package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DimensionValue;
import gr.ekke.socioscope.domain.Observation;
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
    public List<Observation> findObservations(String datasetId, List<DimensionValue> dimensionValues, String measureId) {
        Query query = new Query();

        List<Criteria> criteria = dimensionValues.stream().map(dimensionValue ->
            Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionValue.getId())
                .and("value").is(dimensionValue.getValue()))
        ).collect(Collectors.toList());
        criteria.add(Criteria.where("measures." + measureId).exists(true));
        query.addCriteria(Criteria.where("datasetId").is(datasetId).andOperator(criteria.toArray(new Criteria[criteria.size()])));
        log.debug("Mongo query to get series: {} ", query);

        return mongoTemplate.find(query, Observation.class);
    }
}
