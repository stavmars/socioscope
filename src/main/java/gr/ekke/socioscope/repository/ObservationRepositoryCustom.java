package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DimensionValue;
import gr.ekke.socioscope.domain.Observation;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Custom repository for the Observation entity.
 */
@SuppressWarnings("unused")
public interface ObservationRepositoryCustom {

    List<Observation> findByDatasetAndDimensions(String datasetId, List<DimensionValue> dimensionValues);

}
