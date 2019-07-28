package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.domain.DimensionCode;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.DimensionCodeRepository;
import gr.ekke.socioscope.repository.DimensionRepository;
import gr.ekke.socioscope.repository.search.DimensionSearchRepository;
import gr.ekke.socioscope.security.SecurityUtils;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static gr.ekke.socioscope.security.AuthoritiesConstants.ADMIN;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Dimension.
 */
@Service
public class DimensionService {

    private final Logger log = LoggerFactory.getLogger(DimensionService.class);

    private final DimensionRepository dimensionRepository;

    private final DimensionSearchRepository dimensionSearchRepository;

    private final DataSetRepository dataSetRepository;

    private final DimensionCodeRepository dimensionCodeRepository;

    private final UserService userService;

    public static final String CODELISTS_BY_DIMENSION_ID = "codelistsByDimensionId";

    public DimensionService(DimensionRepository dimensionRepository, DimensionSearchRepository dimensionSearchRepository,
                            DataSetRepository dataSetRepository, DimensionCodeRepository dimensionCodeRepository, UserService userService) {
        this.dimensionRepository = dimensionRepository;
        this.dimensionSearchRepository = dimensionSearchRepository;
        this.dataSetRepository = dataSetRepository;
        this.dimensionCodeRepository = dimensionCodeRepository;
        this.userService = userService;
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
            throw new BadRequestAlertException("Dimension already exists", "dimension", "dimensionexists");
        }
        dimension.setCreator(userService.getUserWithAuthorities().orElse(null));
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
        } else {
            List<Dimension> result = new ArrayList<>();
            for (Dimension dimension : all) {
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

    /**
     * Get the codelist of a dimension
     *
     * @param id the id of the dimension
     * @return the dimension codelist
     */
    @Cacheable(cacheNames = CODELISTS_BY_DIMENSION_ID)
    public Optional<List<DimensionCode>> getDimensionCodelist(String id) {
        log.debug("Request to get the codelist for Dimension : {}", id);
        return dimensionRepository.findById(id).map(dimension -> dimensionCodeRepository.findAllByDimensionId(id));
    }
}
