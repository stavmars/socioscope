package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

public class ObservationRepositoryImpl implements ObservationRepositoryCustom {

    private final Logger log = LoggerFactory.getLogger(ObservationRepositoryImpl.class);


    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public List<Observation> findObservations(DataSet dataset, SeriesOptions seriesOptions) {
        String xAxis = seriesOptions.getxAxis();
        Dimension xAxisDimension = dataset.getDimensions().stream().filter(dimValue -> dimValue.getId().equals(xAxis)).findFirst().orElse(null);
        String compareBy = seriesOptions.getCompareBy();
        Dimension compareByDimension = dataset.getDimensions().stream().filter(dimValue -> dimValue.getId().equals(compareBy)).findFirst().orElse(null);
        List<String> compareCodes = seriesOptions.getCompareCodes();

        Query query = new Query();

        List<DimensionValue> dimensionValues = seriesOptions.getDimensionFilters().entrySet().stream().filter(entry -> entry.getValue() != null)
            .map(entry -> new DimensionValue(entry.getKey(), entry.getValue())).collect(Collectors.toList());

        List<Criteria> criteria = dataset.getDimensions().stream().filter(dim -> !dim.getId().equals(xAxis) && !dim.getId().equals(compareBy)).map(dim -> {
            DimensionValue dimensionValue = dimensionValues.stream().filter(dimValue -> dimValue.getId().equals(dim.getId())).findFirst().orElse(null);
            if ((dimensionValue == null || dimensionValue.getValue() == null || dimensionValue.getValue().equals(""))) {
                if ((xAxisDimension != null && dim.getId().equals(xAxisDimension.getParentDimensionId())) ||
                    (compareByDimension != null && dim.getId().equals(compareByDimension.getParentDimensionId()))) {
                    return Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dim.getId()));
                }
                return Criteria.where("dimensions").not().elemMatch(Criteria.where("id").is(dim.getId()));
            }
            return Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionValue.getId()).and("value").is(dimensionValue.getValue()));
        }).collect(Collectors.toList());

        criteria.add(Criteria.where("dimensions").elemMatch(Criteria.where("id").is(xAxis)));

        if (compareBy != null) {
            Criteria compareCriteria;
            if (compareCodes != null && compareCodes.size() > 0) {
                compareCriteria = Criteria.where("dimensions").elemMatch(Criteria.where("id").is(compareBy).and("value").in(compareCodes));
            } else {
                compareCriteria = Criteria.where("dimensions").elemMatch(Criteria.where("id").is(compareBy));
            }
            criteria.add(compareCriteria);
        }

        criteria.add(Criteria.where("measures." + seriesOptions.getMeasure()).exists(true));
        query.addCriteria(Criteria.where("datasetId").is(dataset.getId()).andOperator(criteria.toArray(new Criteria[criteria.size()])));
        log.debug("Mongo query to get series: {} ", query);

        return mongoTemplate.find(query, Observation.class);
    }

    @Override
    public List<String> findValidCodes(String datasetId, String dimensionId, String otherDimensionId, String otherDimensionValue) {
        Criteria criteria = Criteria.where("datasetId").is(datasetId).andOperator(Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionId)),
            Criteria.where("dimensions").elemMatch(Criteria.where("id").is(otherDimensionId).and("value").is(otherDimensionValue)));
        Aggregation agg = Aggregation.newAggregation(match(criteria), unwind("$dimensions"), match(Criteria.where("dimensions.id").is(dimensionId)),
            project().andExpression("dimensions.value").as("value"), group("value"));
        log.debug("Mongo agg to get valid codes: {} ", agg);
        List<Map> docs = mongoTemplate.aggregate(agg, "observation", Map.class).getMappedResults();
        return docs.stream().map(doc -> doc.get("_id").toString()).collect(Collectors.toList());
    }
}
