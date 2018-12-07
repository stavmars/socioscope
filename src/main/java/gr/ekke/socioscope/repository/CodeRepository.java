package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.Code;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Code entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CodeRepository extends MongoRepository<Code, String> {

}
