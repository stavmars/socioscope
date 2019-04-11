package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Codelist;
import gr.ekke.socioscope.repository.CodelistRepository;
import gr.ekke.socioscope.repository.search.CodelistSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
     * Save a codelist.
     *
     * @param updatedCodelist the entity to save
     * @return the persisted entity
     */
    public Optional<Codelist> updateCodelist(Codelist updatedCodelist) {
        return Optional.of(codelistRepository
            .findById(updatedCodelist.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(codelist -> {
                codelist.setName(updatedCodelist.getName());
                codelist.setDescription(updatedCodelist.getDescription());
                codelist.setCodes(updatedCodelist.getCodes());
                codelistRepository.save(codelist);
                codelistSearchRepository.save(codelist);
                log.debug("Changed Information for Codelist: {}", codelist);
                return codelist;
            });
    }

    /**
     * Get all the codelists.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    public Page<Codelist> findAll(Pageable pageable) {
        log.debug("Request to get all Codelists");
        return codelistRepository.findAll(pageable);
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
     * @param pageable the pagination information
     * @return the list of entities
     */
    public Page<Codelist> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Codelists for query {}", query);
        return codelistSearchRepository.search(queryStringQuery(query), pageable);    }
}
