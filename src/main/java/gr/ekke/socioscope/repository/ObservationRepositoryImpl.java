package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DimensionValue;
import gr.ekke.socioscope.domain.Observation;
import gr.ekke.socioscope.domain.SeriesOptions;
import gr.ekke.socioscope.service.dto.Series;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

public class ObservationRepositoryImpl implements ObservationRepositoryCustom {

    private final Logger log = LoggerFactory.getLogger(ObservationRepositoryImpl.class);


    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public List<Observation> findObservations(String datasetId, SeriesOptions seriesOptions) {
        Query query = new Query();

        List<DimensionValue> dimensionValues = seriesOptions.getDimensionFilters().entrySet().stream()/*.filter(entry -> entry.getValue() != null)*/
            .map(entry -> new DimensionValue(entry.getKey(), entry.getValue())).collect(Collectors.toList());

        List<Criteria> criteria = dimensionValues.stream().map(dimensionValue -> {
            if (dimensionValue.getValue() == null || dimensionValue.getValue().equals("")){
                return Criteria.where("dimensions").not().elemMatch(Criteria.where("id").is(dimensionValue.getId()));
            }
            return Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionValue.getId())
                .and("value").is(dimensionValue.getValue()));}
        ).collect(Collectors.toList());

        String xAxis = seriesOptions.getxAxis();
        criteria.add(Criteria.where("dimensions").elemMatch(Criteria.where("id").is(xAxis)));

        String compareBy = seriesOptions.getCompareBy();
        if (compareBy != null) {
            criteria.add(Criteria.where("dimensions").elemMatch(Criteria.where("id").is(compareBy)));
        }

        criteria.add(Criteria.where("measures." + seriesOptions.getMeasure()).exists(true));
        query.addCriteria(Criteria.where("datasetId").is(datasetId).andOperator(criteria.toArray(new Criteria[criteria.size()])));
        log.debug("Mongo query to get series: {} ", query);

        return mongoTemplate.find(query, Observation.class);
    }

    @Override
    public List<String> findCodesForParent(String datasetId, String dimensionId, String parentDimensionId, String parentDimensionValue) {
        Criteria criteria = Criteria.where("datasetId").is(datasetId).andOperator(Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionId)),
            Criteria.where("dimensions").elemMatch(Criteria.where("id").is(parentDimensionId).and("value").is(parentDimensionValue)));
        Aggregation agg = Aggregation.newAggregation(match(criteria), unwind("$dimensions"), match( Criteria.where("dimensions.id").is(dimensionId)),
            project().andExpression("dimensions.value").as("value"), group("value"));
        List<Map> docs = mongoTemplate.aggregate(agg, "observation", Map.class).getMappedResults();
        return docs.stream().map(doc -> doc.get("_id").toString()).collect(Collectors.toList());
    }
}
