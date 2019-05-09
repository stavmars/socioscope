package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.Observation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the Observation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ObservationRepository extends MongoRepository<Observation, String> {

    List<Observation> findAllByDatasetId(String datasetId);

}
