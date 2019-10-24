package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.*;
import gr.ekke.socioscope.repository.*;
import gr.ekke.socioscope.repository.search.DataSetSearchRepository;
import gr.ekke.socioscope.service.dto.Series;
import gr.ekke.socioscope.service.dto.SeriesPoint;
import gr.ekke.socioscope.service.mapper.ObservationMapper;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing DataSet.
 */
@Service
public class DataSetService {

    private final Logger log = LoggerFactory.getLogger(DataSetService.class);

    private final DataSetRepository dataSetRepository;

    private final DataSetSearchRepository dataSetSearchRepository;

    private final DimensionRepository dimensionRepository;

    private final DimensionCodeRepository dimensionCodeRepository;

    private final MeasureRepository measureRepository;

    private final ObservationRepository observationRepository;

    private final ObservationMapper observationMapper;

    private final RawDataRepository rawDataRepository;

    private final UserService userService;

    public DataSetService(DataSetRepository dataSetRepository, DataSetSearchRepository dataSetSearchRepository, DimensionRepository dimensionRepository,
                          DimensionCodeRepository dimensionCodeRepository, MeasureRepository measureRepository, ObservationRepository observationRepository,
                          ObservationMapper observationMapper, RawDataRepository rawDataRepository, UserService userService) {
        this.dataSetRepository = dataSetRepository;
        this.dataSetSearchRepository = dataSetSearchRepository;
        this.dimensionRepository = dimensionRepository;
        this.dimensionCodeRepository = dimensionCodeRepository;
        this.measureRepository = measureRepository;
        this.observationRepository = observationRepository;
        this.observationMapper = observationMapper;
        this.rawDataRepository = rawDataRepository;
        this.userService = userService;
    }

    /**
     * Save a dataSet.
     *
     * @param dataSet the entity to save
     * @return the persisted entity
     */
    public DataSet create(DataSet dataSet) {
        log.debug("Request to create DataSet : {}", dataSet);
        if (dataSet.getId() != null && dataSetRepository.existsById(dataSet.getId())) {
            throw new BadRequestAlertException("DataSet already exists", "dataSet", "datasetexists");
        }
        dataSet.setCreator(userService.getUserWithAuthorities().orElse(null));
        DataSet result = dataSetRepository.save(dataSet);
        //dataSetSearchRepository.save(result);
        return result;
    }

    /**
     * Update a dataSet.
     *
     * @param dataSet the entity to update
     * @return the persisted entity
     */
    public DataSet update(DataSet dataSet) {
        log.debug("Request to update DataSet : {}", dataSet);
        DataSet result = dataSetRepository.save(dataSet);
        //dataSetSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the dataSets.
     *
     * @return the list of entities
     */
    public List<DataSet> findAll() {
        log.debug("Request to get all DataSets");
        return dataSetRepository.findAll();
    }


    /**
     * Get one dataSet by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<DataSet> findOne(String id) {
        log.debug("Request to get DataSet : {}", id);
        return dataSetRepository.findById(id);
    }

    /**
     * Delete the dataSet by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete DataSet : {}", id);
        observationRepository.deleteByDatasetId(id);
        dataSetRepository.deleteById(id);
        dataSetSearchRepository.deleteById(id);
    }

    /**
     * Search for the dataSet corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<DataSet> search(String query) {
        log.debug("Request to search DataSets for query {}", query);
        return StreamSupport
            .stream(dataSetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    /**
     * Remove one dimension dimensionId from dataSet with dataSetId
     *
     * @param dimensionId the id of the dimension entity
     * @param dataSetId   the id of the dataSet entity
     * @return the entity
     */
    public DataSet removeDimension(String dataSetId, String dimensionId) {
        log.debug("Request to remove Dimension : {} from DataSet : {}", dimensionId, dataSetId);
        Optional<DataSet> dataSet = dataSetRepository.findById(dataSetId);
        Optional<Dimension> dimension = dimensionRepository.findById(dimensionId);

        if (!dataSet.isPresent() || !dimension.isPresent()) {
            return null;
        }
        DataSet result = dataSetRepository.save(dataSet.get().removeDimension(dimension.get()));
        return result;
    }

    /**
     * Get Highlights from a dataset.
     *
     * @param dataSetId
     * @return the requested list
     */
    public List<Highlight> getHighlights(String dataSetId) {
        log.debug("Request to get Highlights of DataSet : {}", dataSetId);
        return dataSetRepository.findById(dataSetId).get().getHighlights();
    }

    /**
     * Add highlights to a dataset.
     *
     * @param dataSetId
     * @param highlights to be added
     * @return the updated dataSet
     */
    public DataSet addHighlights(String dataSetId, List<Highlight> highlights) {
        log.debug("Request to add {} Highlights to DataSet {}", highlights.size(), dataSetId);
        DataSet dataSet = dataSetRepository.findById(dataSetId).get();
        dataSet.addHighlights(highlights);
        dataSetRepository.save(dataSet);
        return dataSet;
    }

    /**
     * Remove one measure measureId from dataSet with dataSetId
     *
     * @param measureId the id of the measure entity
     * @param dataSetId the id of the dataSet entity
     * @return the entity
     */
    public DataSet removeMeasure(String dataSetId, String measureId) {
        log.debug("Request to remove Measure : {} from DataSet : {}", measureId, dataSetId);
        Optional<DataSet> dataSet = dataSetRepository.findById(dataSetId);
        Optional<Measure> measure = measureRepository.findById(measureId);

        if (!dataSet.isPresent() || !measure.isPresent()) {
            return null;
        }
        DataSet result = dataSetRepository.save(dataSet.get().removeMeasure(measure.get()));
        return result;
    }

    /**
     * Get series data from a dataset.
     *
     * @param datasetId
     * @param seriesOptions the observations to add
     * @return the requested series
     */
    public Optional<List<Series>> getSeries(String datasetId, SeriesOptions seriesOptions) {
        log.debug("Request to get series for dataset {} with options {}", datasetId, seriesOptions);
        return dataSetRepository.findById(datasetId)
            .map(dataSet -> {
                Measure measure;
                //if measure is not specified for the series, pick the first one
                if (seriesOptions.getMeasure() == null) {
                    measure = dataSet.getMeasures().get(0);
                    seriesOptions.setMeasure(measure.getId());
                } else {
                    measure = dataSet.getMeasures().stream().filter(m -> m.getId().equals(seriesOptions.getMeasure()))
                        .findFirst().orElseThrow(() ->
                            new BadRequestAlertException("Dataset does not contain the specified measure", "dataSet", "invalid_measure"));
                }

                Dimension xAxisDimension = dataSet.getDimensions().stream().filter(dim -> dim.getId().equals(seriesOptions.getxAxis()))
                    .findFirst().orElseThrow(() ->
                        new BadRequestAlertException("Dataset does not contain the specified xAxis dimension", "dataSet", "invalid_xAxis"));

                // if the dataset contains pre-aggregated cube-like data, we fetch and map the observations to the corresponding series
                if (dataSet.getType().equals(DatasetType.QB)) {
                    List<Observation> observations = observationRepository.findObservations(datasetId, seriesOptions);
                    return observationMapper.observationsToMultipleSeries(observations, seriesOptions);
                } else {
                    // if the dataset contains raw, non-aggregated data, we aggregate it from the corresponding mongo collection

                    if (xAxisDimension.getType().equals(DimensionType.COMPOSITE)) {
                        return this.getCompositeDimensionSeries(dataSet, xAxisDimension, measure, seriesOptions);
                    }

                    List<Series> seriesList = rawDataRepository.getSeries(dataSet, seriesOptions);

                    if (measure.getType().equals(MeasureType.PERCENTAGE)) {
                        if (seriesOptions.getCompareBy() == null) {
                            Double totalCount = seriesList.get(0).getData().stream().collect(Collectors.summingDouble(SeriesPoint::getY));
                            List<SeriesPoint> seriesPoints = seriesList.get(0).getData().stream().map(seriesPoint -> new SeriesPoint(seriesPoint.getX(), (seriesPoint.getY() / totalCount) * 100d)).collect(Collectors.toList());
                            seriesList.get(0).setData(seriesPoints);
                        } else {
                            SeriesOptions totalSeriesOptions = new SeriesOptions().xAxis(seriesOptions.getxAxis())
                                .measure(seriesOptions.getMeasure()).dimensionFilters(seriesOptions.getDimensionFilters());
                            Series totalSeries = rawDataRepository.getSeries(dataSet, totalSeriesOptions).get(0);

                            Map<String, Double> denominatorsByX = totalSeries.getData().stream().collect(Collectors.toMap(SeriesPoint::getX, SeriesPoint::getY));
                            seriesList = seriesList.stream().map(series -> {
                                List<SeriesPoint> percentPoints = series.getData().stream().map(seriesPoint -> {
                                    String x = seriesPoint.getX();
                                    Double y = seriesPoint.getY();
                                    return new SeriesPoint(x, (y / denominatorsByX.get(x)) * 100d);
                                }).collect(Collectors.toList());
                                series.setData(percentPoints);
                                return series;
                            }).collect(Collectors.toList());
                        }
                    }
                    return seriesList;
                }
            });
    }

    private List<Series> getCompositeDimensionSeries(DataSet dataset, Dimension xAxisDimension, Measure measure, SeriesOptions seriesOptions) {
        List<String> composedOf = xAxisDimension.getComposedOf();
        Map<String, Series> seriesMap = new HashMap<>();
        DecimalFormat df = new DecimalFormat("#.0");

        composedOf.stream().forEach(dim -> {
            SeriesOptions compSeriesOptions = new SeriesOptions();
            compSeriesOptions.setMeasure(seriesOptions.getMeasure());
            compSeriesOptions.setxAxis(dim);
            compSeriesOptions.setDimensionFilters(seriesOptions.getDimensionFilters());
            Series series = rawDataRepository.getSeries(dataset, compSeriesOptions).get(0);

            boolean computePercentages = measure.getType().equals(MeasureType.PERCENTAGE);
            Double total = computePercentages ? series.getData().stream().mapToDouble(SeriesPoint::getY).sum() : 1;


            series.getData().stream().forEach(seriesPoint -> {
                Series newSeries = seriesMap.get(seriesPoint.getX());
                if (newSeries == null) {
                    newSeries = new Series();
                    newSeries.setId(seriesPoint.getX());
                    newSeries.setData(new ArrayList<>());
                    seriesMap.put(seriesPoint.getX(), newSeries);
                }
                newSeries.getData().add(new SeriesPoint(dim, computePercentages ? Double.parseDouble(df.format(seriesPoint.getY() * 100 / total)) : seriesPoint.getY()));
            });

        });
        return new ArrayList<Series>(seriesMap.values());
    }

    /**
     * Get codelists data from a dataset.
     *
     * @param datasetId
     * @return the requested codelists
     */
    public Optional<Map<String, List<DimensionCode>>> getCodelists(String datasetId) {
        log.debug("Request to get codelists for dataset {}", datasetId);
        return dataSetRepository.findById(datasetId)
            .map(dataSet -> {
                Map<String, List<DimensionCode>> codelistMap = new HashMap<String, List<DimensionCode>>();
                dataSet.getDimensions().forEach(dimension -> {
                    codelistMap.put(dimension.getId(), dimensionCodeRepository.findAllByDimensionId(dimension.getId()));
                });
                return codelistMap;
            });
    }
}
