package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.service.MeasureService;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import gr.ekke.socioscope.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;


/**
 * REST controller for managing Measure.
 */
@RestController
@RequestMapping("/api")
public class MeasureResource {

    private final Logger log = LoggerFactory.getLogger(MeasureResource.class);

    private static final String ENTITY_NAME = "measure";

    private final MeasureService measureService;

    public MeasureResource(MeasureService measureService) {
        this.measureService = measureService;
    }

    /**
     * POST  /measures : Create a new measure.
     *
     * @param measure the measure to create
     * @return the ResponseEntity with status 201 (Created) and with body the new measure, or with status 400 (Bad Request) if the measure has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/measures")
    @Timed
    public ResponseEntity<Measure> createMeasure(@Valid @RequestBody Measure measure) throws URISyntaxException {
        log.debug("REST request to create Measure : {}", measure);
        Measure result = measureService.create(measure);
        return ResponseEntity.created(new URI("/api/measures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /measures : Updates an existing measure.
     *
     * @param measure the measure to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated measure,
     * or with status 400 (Bad Request) if the measure is not valid,
     * or with status 500 (Internal Server Error) if the measure couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/measures")
    @Timed
    public ResponseEntity<Measure> updateMeasure(@Valid @RequestBody Measure measure) throws URISyntaxException {
        log.debug("REST request to update Measure : {}", measure);
        if (measure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Measure result = measureService.update(measure);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, measure.getId().toString()))
            .body(result);
    }

    /**
     * GET  /measures : get all the measures.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of measures in body
     */
    @GetMapping("/measures")
    @Timed
    public List<Measure> getAllMeasures() {
        log.debug("REST request to get all Measures");
        return measureService.findAll();
    }

    /**
     * GET  /measures/:id : get the "id" measure.
     *
     * @param id the id of the measure to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the measure, or with status 404 (Not Found)
     */
    @GetMapping("/measures/{id}")
    @Timed
    public ResponseEntity<Measure> getMeasure(@PathVariable String id) {
        log.debug("REST request to get Measure : {}", id);
        Optional<Measure> measure = measureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(measure);
    }

    /**
     * DELETE  /measures/:id : delete the "id" measure.
     *
     * @param id the id of the measure to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/measures/{id}")
    @Timed
    public ResponseEntity<Void> deleteMeasure(@PathVariable String id) {
        log.debug("REST request to delete Measure : {}", id);
        if (measureService.delete(id)) {
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
        }
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "dim_mes", id)).build();
    }

}
