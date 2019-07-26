package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DimensionValue;
import gr.ekke.socioscope.domain.Observation;
import gr.ekke.socioscope.domain.SeriesOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.stream.Collectors;

public class ObservationRepositoryImpl implements ObservationRepositoryCustom {

    private final Logger log = LoggerFactory.getLogger(ObservationRepositoryImpl.class);


    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public List<Observation> findObservations(String datasetId, SeriesOptions seriesOptions) {
        Query query = new Query();

        List<DimensionValue> dimensionValues = seriesOptions.getDimensionFilters().entrySet().stream().filter(entry -> entry.getValue() != null)
            .map(entry -> new DimensionValue(entry.getKey(), entry.getValue())).collect(Collectors.toList());

        List<Criteria> criteria = dimensionValues.stream().map(dimensionValue ->
            Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionValue.getId())
                .and("value").is(dimensionValue.getValue()))
        ).collect(Collectors.toList());

        String compareBy = seriesOptions.getCompareBy();
        if (compareBy != null){
            criteria.add(Criteria.where("dimensions").elemMatch(Criteria.where("id").is(compareBy).and("value").in(seriesOptions.getCompareCodes())));
        }

        criteria.add(Criteria.where("measures." + seriesOptions.getMeasure()).exists(true));
        query.addCriteria(Criteria.where("datasetId").is(datasetId).andOperator(criteria.toArray(new Criteria[criteria.size()])));
        log.debug("Mongo query to get series: {} ", query);

        return mongoTemplate.find(query, Observation.class);
    }
}
