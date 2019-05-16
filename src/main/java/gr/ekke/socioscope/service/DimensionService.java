package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.DimensionRepository;
import gr.ekke.socioscope.repository.UserRepository;
import gr.ekke.socioscope.repository.search.DimensionSearchRepository;
import gr.ekke.socioscope.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static gr.ekke.socioscope.security.AuthoritiesConstants.ADMIN;
import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Dimension.
 */
@Service
public class DimensionService {

    private final Logger log = LoggerFactory.getLogger(DimensionService.class);

    private final DimensionRepository dimensionRepository;

    private final DimensionSearchRepository dimensionSearchRepository;

    private final DataSetRepository dataSetRepository;

    private final UserRepository userRepository;

    public DimensionService(DimensionRepository dimensionRepository, DimensionSearchRepository dimensionSearchRepository, DataSetRepository dataSetRepository, UserRepository userRepository) {
        this.dimensionRepository = dimensionRepository;
        this.dimensionSearchRepository = dimensionSearchRepository;
        this.dataSetRepository = dataSetRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a dimension.
     *
     * @param dimension the entity to create
     * @return the persisted entity
     */
    public Dimension create(Dimension dimension) {
        log.debug("Request to create Dimension : {}", dimension);
        if (dimension.getId() != null && dimensionRepository.existsById(dimension.getId())) {
            return null;
        }
        String login = SecurityUtils.getCurrentUserLogin().get();
        dimension.setCreator(userRepository.findOneByLogin(login).get());
        Dimension result = dimensionRepository.save(dimension);
        dimensionSearchRepository.save(result);
        return result;
    }

    /**
     * Update a dimension.
     *
     * @param dimension the entity to update
     * @return the persisted entity
     */
    public Dimension update(Dimension dimension) {
        log.debug("Request to update Dimension : {}", dimension);
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
        List<Dimension> all = dimensionRepository.findAll();
        if (SecurityUtils.isCurrentUserInRole(ADMIN)) {
            return all;
        }
        else {
            List<Dimension> result = new ArrayList<>();
            for (Dimension dimension: all) {
                if (!dimension.getCreator().getLogin().equals("admin")) {
                    result.add(dimension);
                }
            }
            return result;
        }
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
    public boolean delete(String id) {
        log.debug("Request to delete Dimension : {}", id);
        Optional<Dimension> dimension = findOne(id);
        if (dimension.isPresent() && dataSetRepository.findAllByDimensionsContains(dimension.get()).isEmpty()) {
            dimensionRepository.delete(dimension.get());
            dimensionSearchRepository.deleteById(id);
            return true;
        }
        return false;
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
