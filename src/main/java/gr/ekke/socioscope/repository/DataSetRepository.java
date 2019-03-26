package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DataSet;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the DataSet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataSetRepository extends MongoRepository<DataSet, String> {

}
