package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.repository.DimensionRepository;
import gr.ekke.socioscope.repository.search.DimensionSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Dimension.
 */
@Service
public class DimensionService {

    private final Logger log = LoggerFactory.getLogger(DimensionService.class);

    private final DimensionRepository dimensionRepository;

    private final DimensionSearchRepository dimensionSearchRepository;

    public DimensionService(DimensionRepository dimensionRepository, DimensionSearchRepository dimensionSearchRepository) {
        this.dimensionRepository = dimensionRepository;
        this.dimensionSearchRepository = dimensionSearchRepository;
    }

    /**
     * Save a dimension.
     *
     * @param dimension the entity to save
     * @return the persisted entity
     */
    public Dimension save(Dimension dimension) {
        log.debug("Request to save Dimension : {}", dimension);
        Dimension result = dimensionRepository.save(dimension);
        dimensionSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the dimensions.
     *
     * @return the list of entities
     */
    public List<Dimension> findAll() {
        log.debug("Request to get all Dimensions");
        return dimensionRepository.findAll();
    }


    /**
     * Get one dimension by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Dimension> findOne(String id) {
        log.debug("Request to get Dimension : {}", id);
        return dimensionRepository.findById(id);
    }

    /**
     * Delete the dimension by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Dimension : {}", id);
        dimensionRepository.deleteById(id);
        dimensionSearchRepository.deleteById(id);
    }

    /**
     * Search for the dimension corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<Dimension> search(String query) {
        log.debug("Request to search Dimensions for query {}", query);
        return StreamSupport
            .stream(dimensionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
