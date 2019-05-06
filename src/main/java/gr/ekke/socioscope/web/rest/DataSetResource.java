package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.security.SecurityUtils;
import gr.ekke.socioscope.service.DataSetService;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import gr.ekke.socioscope.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing DataSet.
 */
@RestController
@RequestMapping("/api")
public class DataSetResource {

    private final Logger log = LoggerFactory.getLogger(DataSetResource.class);

    private static final String ENTITY_NAME = "dataSet";

    private final DataSetService dataSetService;

    public DataSetResource(DataSetService dataSetService) {
        this.dataSetService = dataSetService;
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
        log.debug("REST request to save DataSet : {}", dataSet);
        if (dataSet.getId() != null) {
            throw new BadRequestAlertException("A new dataSet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataSet result = dataSetService.save(dataSet);
        return ResponseEntity.created(new URI("/api/data-sets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
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
        DataSet result = dataSetService.save(dataSet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataSet.getId().toString()))
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
        if (dataSet.isPresent() && dataSet.get().getCreator() != null &&
            !SecurityUtils.getCurrentUserLogin().get().equals("admin") &&
            !dataSet.get().getCreator().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))){
            System.out.println("POUTSA");
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
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
     * @param dataSetId the dataSet to update
     * @param dimensionId the dimension to remove
     * @return the ResponseEntity with status 200 (OK) and with body the updated dataSet,
     * or with status 400 (Bad Request) if the dataSet is not valid,
     * or with status 500 (Internal Server Error) if the dataSet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/data-sets/{dataSetId}/dimension/{dimensionId}")
    @Timed
    public ResponseEntity<DataSet> removeDimension(@PathVariable String dataSetId, @PathVariable String dimensionId) throws URISyntaxException {
        log.debug("REST request to remove Dimension : {} from DataSet : {}", dataSetId, dimensionId);
        DataSet result = dataSetService.removeDimension(dataSetId, dimensionId);
        if (result == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataSetId))
            .body(result);
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
    public ResponseEntity<DataSet> removeMeasure(@PathVariable String dataSetId, @PathVariable String measureId) throws URISyntaxException {
        log.debug("REST request to remove Measure : {} from DataSet : {}", dataSetId, measureId);
        DataSet result = dataSetService.removeMeasure(dataSetId, measureId);
        if (result == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dataSetId))
            .body(result);
    }
}
