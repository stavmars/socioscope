package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.Dimension;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the Dimension entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DimensionRepository extends MongoRepository<Dimension, String> {

}
