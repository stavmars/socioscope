package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DimensionCode;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the DimensionCode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DimensionCodeRepository extends MongoRepository<DimensionCode, String> {

}
