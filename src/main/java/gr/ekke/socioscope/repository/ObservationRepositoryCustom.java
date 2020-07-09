package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.Observation;
import gr.ekke.socioscope.domain.SeriesOptions;

import java.util.List;

/**
 * Custom repository for the Observation entity.
 */
@SuppressWarnings("unused")
public interface ObservationRepositoryCustom {

    List<Observation> findObservations(String datasetId, SeriesOptions seriesOptions);

    List<String> findValidCodes(String datasetId, String dimensionId, String otherDimensionId, String otherDimensionValue);

}
