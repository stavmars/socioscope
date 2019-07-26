package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.DimensionValue;
import gr.ekke.socioscope.domain.Observation;
import gr.ekke.socioscope.domain.SeriesOptions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Custom repository for the Observation entity.
 */
@SuppressWarnings("unused")
public interface ObservationRepositoryCustom {

    List<Observation> findObservations(String datasetId, SeriesOptions seriesOptions);

}
