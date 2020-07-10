package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.domain.DimensionCode;
import gr.ekke.socioscope.service.DimensionService;
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
 * REST controller for managing Dimension.
 */
@RestController
@RequestMapping("/api")
public class DimensionResource {

    private static final String ENTITY_NAME = "dimension";
    private final Logger log = LoggerFactory.getLogger(DimensionResource.class);
    private final DimensionService dimensionService;


    public DimensionResource(DimensionService dimensionService) {
        this.dimensionService = dimensionService;
    }

    /**
     * POST  /dimensions : Create a new dimension.
     *
     * @param dimension the dimension to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dimension, or with status 400 (Bad Request) if the dimension has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/dimensions")
    @Timed
    public ResponseEntity<Dimension> createDimension(@Valid @RequestBody Dimension dimension) throws URISyntaxException {
        log.debug("REST request to create Dimension : {}", dimension);
        Dimension result = dimensionService.create(dimension);
        return ResponseEntity.created(new URI("/api/dimensions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /dimensions : Updates an existing dimension.
     *
     * @param dimension the dimension to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dimension,
     * or with status 400 (Bad Request) if the dimension is not valid,
     * or with status 500 (Internal Server Error) if the dimension couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/dimensions")
    @Timed
    public ResponseEntity<Dimension> updateDimension(@Valid @RequestBody Dimension dimension) throws URISyntaxException {
        log.debug("REST request to update Dimension : {}", dimension);
        if (dimension.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Dimension result = dimensionService.update(dimension);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dimension.getId().toString()))
            .body(result);
    }

    /**
     * GET  /dimensions : get all the dimensions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dimensions in body
     */
    @GetMapping("/dimensions")
    @Timed
    public List<Dimension> getAllDimensions() {
        log.debug("REST request to get all Dimensions");
        return dimensionService.findAll();
    }

    /**
     * GET  /dimensions/:id : get the "id" dimension.
     *
     * @param id the id of the dimension to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dimension, or with status 404 (Not Found)
     */
    @GetMapping("/dimensions/{id}")
    @Timed
    public ResponseEntity<Dimension> getDimension(@PathVariable String id) {
        log.debug("REST request to get Dimension : {}", id);
        Optional<Dimension> dimension = dimensionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dimension);
    }

    /**
     * GET  /dimensions/:id/codelist : get the codelist for the "id" dimension.
     *
     * @param id the id of the dimension
     * @return the ResponseEntity with status 200 (OK) and with body the dimension codelist, or with status 404 (Not Found)
     */
    @GetMapping("/dimensions/{id}/codelist")
    @Timed
    public ResponseEntity<List<DimensionCode>> getDimensionCodelist(@PathVariable String id) {
        log.debug("REST request to get codelist for Dimension : {}", id);
        return ResponseUtil.wrapOrNotFound(dimensionService.getDimensionCodelist(id));
    }

    /**
     * DELETE  /dimensions/:id : delete the "id" dimension.
     *
     * @param id the id of the dimension to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/dimensions/{id}")
    @Timed
    public ResponseEntity<Void> deleteDimension(@PathVariable String id) {
        log.debug("REST request to delete Dimension : {}", id);
        if (dimensionService.delete(id)) {
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
        }
        return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "dim_mes", id)).build();
    }

}
