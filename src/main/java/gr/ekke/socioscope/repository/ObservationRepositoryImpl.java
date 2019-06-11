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

public class ObservationRepositoryImpl implements ObservationRepositoryCustom {

    private final Logger log = LoggerFactory.getLogger(ObservationRepositoryImpl.class);


    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public List<Observation> findByDatasetAndDimensions(String datasetId, List<DimensionValue> dimensionValues) {
        Query query = new Query();

        Criteria[] dimensionCriteria = dimensionValues.stream().map(dimensionValue ->
            Criteria.where("dimensions").elemMatch(Criteria.where("id").is(dimensionValue.getId())
                .and("value").is(dimensionValue.getValue()))
        ).toArray(Criteria[]::new);

        query.addCriteria(Criteria.where("datasetId").is(datasetId).andOperator(dimensionCriteria));
        log.debug("Mongo query to get series: {} ", query);

        return mongoTemplate.find(query, Observation.class);
    }
}
