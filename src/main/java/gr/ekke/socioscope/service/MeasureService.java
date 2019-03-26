package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.repository.MeasureRepository;
import gr.ekke.socioscope.repository.search.MeasureSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Measure.
 */
@Service
public class MeasureService {

    private final Logger log = LoggerFactory.getLogger(MeasureService.class);

    private final MeasureRepository measureRepository;

    private final MeasureSearchRepository measureSearchRepository;

    public MeasureService(MeasureRepository measureRepository, MeasureSearchRepository measureSearchRepository) {
        this.measureRepository = measureRepository;
        this.measureSearchRepository = measureSearchRepository;
    }

    /**
     * Save a measure.
     *
     * @param measure the entity to save
     * @return the persisted entity
     */
    public Measure save(Measure measure) {
        log.debug("Request to save Measure : {}", measure);
        Measure result = measureRepository.save(measure);
        measureSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the measures.
     *
     * @return the list of entities
     */
    public List<Measure> findAll() {
        log.debug("Request to get all Measures");
        return measureRepository.findAll();
    }


    /**
     * Get one measure by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Measure> findOne(String id) {
        log.debug("Request to get Measure : {}", id);
        return measureRepository.findById(id);
    }

    /**
     * Delete the measure by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Measure : {}", id);
        measureRepository.deleteById(id);
        measureSearchRepository.deleteById(id);
    }

    /**
     * Search for the measure corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<Measure> search(String query) {
        log.debug("Request to search Measures for query {}", query);
        return StreamSupport
            .stream(measureSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
