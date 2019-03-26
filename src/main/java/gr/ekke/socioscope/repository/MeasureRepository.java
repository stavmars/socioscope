package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.Measure;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Measure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MeasureRepository extends MongoRepository<Measure, String> {

}
