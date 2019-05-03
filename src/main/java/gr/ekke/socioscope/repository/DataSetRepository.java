package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.domain.Measure;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the DataSet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataSetRepository extends MongoRepository<DataSet, String> {
    List<DataSet> findAllByDimensionsContains(Dimension dimension);

    List<DataSet> findAllByMeasuresContains(Measure measure);
}
