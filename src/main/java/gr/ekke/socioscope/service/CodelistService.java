package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Codelist;
import gr.ekke.socioscope.repository.CodelistRepository;
import gr.ekke.socioscope.repository.search.CodelistSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Codelist.
 */
@Service
public class CodelistService {

    private final Logger log = LoggerFactory.getLogger(CodelistService.class);

    private final CodelistRepository codelistRepository;

    private final CodelistSearchRepository codelistSearchRepository;

    private final UserService userService;

    public CodelistService(CodelistRepository codelistRepository, CodelistSearchRepository codelistSearchRepository, UserService userService) {
        this.codelistRepository = codelistRepository;
        this.codelistSearchRepository = codelistSearchRepository;
        this.userService = userService;
    }

    /**
     * Create a codelist.
     *
     * @param codelist the codelist to save
     * @return the persisted codelist
     */
    public Codelist createCodelist(Codelist codelist) {
        codelist.setCreator(userService.getUserWithAuthorities().orElse(null));
        codelistRepository.save(codelist);
        codelistSearchRepository.save(codelist);
        log.debug("Created Codelist: {}", codelist);
        return codelist;
    }

    /**
     * Update all information for a specific codelist, and return the modified codelist.
     *
     * @param updatedCodelist codelist to update
     * @return updated codelist
     */
    public Optional<Codelist> updateCodelist(Codelist updatedCodelist) {
        return Optional.of(codelistRepository
            .findById(updatedCodelist.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(codelist -> {
                codelist.setName(updatedCodelist.getName());
                codelist.setDescription(updatedCodelist.getDescription());
                codelistRepository.save(codelist);
                codelistSearchRepository.save(codelist);
                log.debug("Changed Information for Codelist: {}", codelist);
                return codelist;
            });
    }


    /**
     * Get all the codelists.
     *
     * @return the list of entities
     */
    public List<Codelist> findAll() {
        log.debug("Request to get all Codelists");
        return codelistRepository.findAll();
    }


    /**
     * Get one codelist by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Codelist> findOne(String id) {
        log.debug("Request to get Codelist : {}", id);
        return codelistRepository.findById(id);
    }

    /**
     * Delete the codelist by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Codelist : {}", id);
        codelistRepository.deleteById(id);
        codelistSearchRepository.deleteById(id);
    }

    /**
     * Search for the codelist corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<Codelist> search(String query) {
        log.debug("Request to search Codelists for query {}", query);
        return StreamSupport
            .stream(codelistSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
