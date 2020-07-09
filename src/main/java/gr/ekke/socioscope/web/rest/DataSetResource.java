package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.*;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.ObservationRepository;
import gr.ekke.socioscope.service.DataSetService;
import gr.ekke.socioscope.service.dto.Series;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import gr.ekke.socioscope.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing DataSet.
 */
@RestController
@RequestMapping("/api")
public class DataSetResource {

    private static final String ENTITY_NAME = "dataSet";
    private final Logger log = LoggerFactory.getLogger(DataSetResource.class);
    private final DataSetService dataSetService;
    private final DataSetRepository dataSetRepository;
    private final ObservationRepository observationRepository;


    public DataSetResource(DataSetService dataSetService, DataSetRepository dataSetRepository, ObservationRepository observationRepository) {
        this.dataSetService = dataSetService;
        this.dataSetRepository = dataSetRepository;
        this.observationRepository = observationRepository;
    }

    /**
     * POST  /data-sets : Create a new dataSet.
     *
     * @param dataSet the dataSet to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dataSet, or with status 400 (Bad Request) if the dataSet has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-sets")
    @Timed
    public ResponseEntity<DataSet> createDataSet(@Valid @RequestBody DataSet dataSet) throws URISyntaxException {
        log.debug("REST request to create DataSet : {}", dataSet);
        DataSet result = dataSetService.create(dataSet);
        return ResponseEntity.created(new URI("/api/data-sets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /data-sets : Updates an existing dataSet.
     *
     * @param dataSet the dataSet to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataSet,
     * or with status 400 (Bad Request) if the dataSet is not valid,
     * or with status 500 (Internal Server Error) if the dataSet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-sets")
    @Timed
    public ResponseEntity<DataSet> updateDataSet(@Valid @RequestBody DataSet dataSet) throws URISyntaxException {
        log.debug("REST request to update DataSet : {}", dataSet);
        if (dataSet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DataSet result = dataSetService.update(dataSet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataSet.getId()))
            .body(result);
    }

    /**
     * GET  /data-sets : get all the dataSets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dataSets in body
     */
    @GetMapping("/data-sets")
    @Timed
    public List<DataSet> getAllDataSets() {
        log.debug("REST request to get all DataSets");
        return dataSetService.findAll();
    }

    /**
     * GET  /data-sets/:id : get the "id" dataSet.
     *
     * @param id the id of the dataSet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dataSet, or with status 404 (Not Found)
     */
    @GetMapping("/data-sets/{id}")
    @Timed
    public ResponseEntity<?> getDataSet(@PathVariable String id) {
        log.debug("REST request to get DataSet : {}", id);
        Optional<DataSet> dataSet = dataSetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dataSet);
    }

    /**
     * DELETE  /data-sets/:id : delete the "id" dataSet.
     *
     * @param id the id of the dataSet to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/data-sets/{id}")
    @Timed
    public ResponseEntity<Void> deleteDataSet(@PathVariable String id) {
        log.debug("REST request to delete DataSet : {}", id);
        dataSetService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/data-sets?query=:query : search for the dataSet corresponding
     * to the query.
     *
     * @param query the query of the dataSet search
     * @return the result of the search
     */
    @GetMapping("/_search/data-sets")
    @Timed
    public List<DataSet> searchDataSets(@RequestParam String query) {
        log.debug("REST request to search DataSets for query {}", query);
        return dataSetService.search(query);
    }

    /**
     * PUT  /data-sets/:dataSetId/:dimensionId : Remove a dimension from an existing dataSet.
     *
     * @param dataSetId   the dataSet to update
     * @param dimensionId the dimension to remove
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataSet,
     * or with status 400 (Bad Request) if the dataSet is not valid,
     * or with status 500 (Internal Server Error) if the dataSet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-sets/{dataSetId}/dimension/{dimensionId}")
    @Timed
    public DataSet removeDimension(@PathVariable String dataSetId, @PathVariable String dimensionId) throws URISyntaxException {
        log.debug("REST request to remove Dimension : {} from DataSet : {}", dataSetId, dimensionId);
        return dataSetService.removeDimension(dataSetId, dimensionId);
    }

    /**
     * PUT  /data-sets/:dataSetId/:measureId : Remove a dimension from an existing dataSet.
     *
     * @param dataSetId the dataSet to update
     * @param measureId the measure to remove
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataSet,
     * or with status 400 (Bad Request) if the dataSet is not valid,
     * or with status 500 (Internal Server Error) if the dataSet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-sets/{dataSetId}/measure/{measureId}")
    @Timed
    public DataSet removeMeasure(@PathVariable String dataSetId, @PathVariable String measureId) throws URISyntaxException {
        log.debug("REST request to remove Measure : {} from DataSet : {}", dataSetId, measureId);
        return dataSetService.removeMeasure(dataSetId, measureId);
    }

    /**
     * GET  /data-sets/:id/highlights : get highlights from dataSet with "id".
     *
     * @param dataSetId the id of the dataSet to retrieve the highlights
     * @return the requested highlights
     */
    @GetMapping("/data-sets/{dataSetId}/highlights")
    @Timed
    public List<Highlight> getHighlights(@PathVariable String dataSetId) {
        log.debug("REST request to get Highlights from DataSet : {}", dataSetId);
        return dataSetService.getHighlights(dataSetId);
    }

    /**
     * PUT  /data-sets/:id/highlights : add highlights to dataSet with "id".
     *
     * @param dataSetId  the id of the dataSet to retrieve the highlights
     * @param highlights to be added
     * @return the updated dataSet
     */
    @PutMapping("/data-sets/{dataSetId}/highlights")
    @Timed
    public DataSet addHighlights(@PathVariable String dataSetId, @Valid @RequestBody List<Highlight> highlights) {
        log.debug("REST request to add {} Highlights to DataSet : {} ", highlights.size(), dataSetId);
        return dataSetService.addHighlights(dataSetId, highlights);
    }

    /**
     * POST  /data-sets/:dataSetId/data : Add observations to a dataset.
     *
     * @param dataSetId    the dataSet to update
     * @param observations the observations to add
     * @return the ResponseEntity with status 201 (Created) and with body the number of new observations created, or with status 400 (Bad Request)
     * if any of the observations have already an ID or the dataset does not exist
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-sets/{dataSetId}/data")
    @Timed
    public ResponseEntity<Integer> addObservations(@PathVariable String dataSetId, @Valid @RequestBody List<Observation> observations) throws URISyntaxException {
        log.debug("REST request to add {} observations to dataset {}", observations.size(), dataSetId);
        for (Observation observation : observations) {
            if (observation.getId() != null) {
                throw new BadRequestAlertException("A new observation cannot already have an ID", "observation", "idexists");
            }
            if (!dataSetRepository.existsById(dataSetId)) {
                return ResponseEntity.notFound().build();
            }
            observation.setDatasetId(dataSetId);
        }
        List<Observation> result = observationRepository.saveAll(observations);
        return ResponseEntity.status(HttpStatus.CREATED).body(result.size());
    }

    /**
     * POST  /data-sets/:dataSetId/series : Get series data from a dataset.
     *
     * @param dataSetId
     * @param seriesOptions the observations to add
     * @return the ResponseEntity with status 201 (Created) and with body the requested series, or with status 400 (Bad Request)
     * if any of the observations have already an ID or the dataset does not exist
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/data-sets/{dataSetId}/series")
    @Timed
    public ResponseEntity<List<Series>> getSeries(@PathVariable String dataSetId, @Valid @RequestBody SeriesOptions seriesOptions) throws URISyntaxException {
        log.debug("REST request to get series for dataset {} with options {}", dataSetId, seriesOptions);
        return ResponseUtil.wrapOrNotFound(dataSetService.getSeries(dataSetId, seriesOptions));
    }

    /**
     * GET  /data-sets/:id/codelists: get codelists of all dimensions from dataSet with "id".
     *
     * @param dataSetId the id of the dataSet to retrieve the codelists.
     * @return the ResponseEntity with status 201 (Created) and with body the requested codelists, or with status 400 (Bad Request)
     * if the dataset does not exist
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @GetMapping("/data-sets/{dataSetId}/codelists")
    @Timed
    public ResponseEntity<Map<String, List<DimensionCode>>> getCodelists(@PathVariable String dataSetId) throws URISyntaxException {
        log.debug("REST request to get Highlights from DataSet : {}", dataSetId);
        return ResponseUtil.wrapOrNotFound(dataSetService.getCodelists(dataSetId));
    }


    @GetMapping("/data-sets/{dataSetId}/validCodes")
    @Timed
    public List<String> findValidCodes(@PathVariable String dataSetId, @RequestParam String dimensionId,
                                          @RequestParam String otherDimensionId,
                                          @RequestParam String otherDimensionValue) {
        log.debug("REST request to get codes for parent for DataSet : {}", dataSetId);
        return observationRepository.findValidCodes(dataSetId, dimensionId, otherDimensionId, otherDimensionValue);
    }
}
