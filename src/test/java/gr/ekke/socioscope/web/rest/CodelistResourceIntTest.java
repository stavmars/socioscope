package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.Codelist;
import gr.ekke.socioscope.repository.CodelistRepository;
import gr.ekke.socioscope.repository.search.CodelistSearchRepository;
import gr.ekke.socioscope.service.CodelistService;
import gr.ekke.socioscope.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;


import static gr.ekke.socioscope.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CodelistResource REST controller.
 *
 * @see CodelistResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class CodelistResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";


    @Autowired
    private CodelistRepository codelistRepository;

    @Autowired
    private CodelistService codelistService;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.CodelistSearchRepositoryMockConfiguration
     */
    @Autowired
    private CodelistSearchRepository mockCodelistSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restCodelistMockMvc;

    private Codelist codelist;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CodelistResource codelistResource = new CodelistResource(codelistService);
        this.restCodelistMockMvc = MockMvcBuilders.standaloneSetup(codelistResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Codelist createEntity() {
        Codelist codelist = new Codelist()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return codelist;
    }

    @Before
    public void initTest() {
        codelistRepository.deleteAll();
        codelist = createEntity();
    }

    @Test
    public void createCodelist() throws Exception {
        int databaseSizeBeforeCreate = codelistRepository.findAll().size();

        // Create the Codelist
        restCodelistMockMvc.perform(post("/api/codelists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(codelist)))
            .andExpect(status().isCreated());

        // Validate the Codelist in the database
        List<Codelist> codelistList = codelistRepository.findAll();
        assertThat(codelistList).hasSize(databaseSizeBeforeCreate + 1);
        Codelist testCodelist = codelistList.get(codelistList.size() - 1);
        assertThat(testCodelist.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCodelist.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the Codelist in Elasticsearch
        verify(mockCodelistSearchRepository, times(1)).save(testCodelist);
    }

    @Test
    public void createCodelistWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = codelistRepository.findAll().size();

        // Create the Codelist with an existing ID
        codelist.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restCodelistMockMvc.perform(post("/api/codelists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(codelist)))
            .andExpect(status().isBadRequest());

        // Validate the Codelist in the database
        List<Codelist> codelistList = codelistRepository.findAll();
        assertThat(codelistList).hasSize(databaseSizeBeforeCreate);

        // Validate the Codelist in Elasticsearch
        verify(mockCodelistSearchRepository, times(0)).save(codelist);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = codelistRepository.findAll().size();
        // set the field null
        codelist.setName(null);

        // Create the Codelist, which fails.

        restCodelistMockMvc.perform(post("/api/codelists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(codelist)))
            .andExpect(status().isBadRequest());

        List<Codelist> codelistList = codelistRepository.findAll();
        assertThat(codelistList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllCodelists() throws Exception {
        // Initialize the database
        codelistRepository.save(codelist);

        // Get all the codelistList
        restCodelistMockMvc.perform(get("/api/codelists?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(codelist.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    public void getCodelist() throws Exception {
        // Initialize the database
        codelistRepository.save(codelist);

        // Get the codelist
        restCodelistMockMvc.perform(get("/api/codelists/{id}", codelist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(codelist.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    public void getNonExistingCodelist() throws Exception {
        // Get the codelist
        restCodelistMockMvc.perform(get("/api/codelists/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateCodelist() throws Exception {
        // Initialize the database
        codelistService.createCodelist(codelist);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCodelistSearchRepository);

        int databaseSizeBeforeUpdate = codelistRepository.findAll().size();

        // Update the codelist
        Codelist updatedCodelist = codelistRepository.findById(codelist.getId()).get();
        updatedCodelist
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restCodelistMockMvc.perform(put("/api/codelists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCodelist)))
            .andExpect(status().isOk());

        // Validate the Codelist in the database
        List<Codelist> codelistList = codelistRepository.findAll();
        assertThat(codelistList).hasSize(databaseSizeBeforeUpdate);
        Codelist testCodelist = codelistList.get(codelistList.size() - 1);
        assertThat(testCodelist.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCodelist.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the Codelist in Elasticsearch
        verify(mockCodelistSearchRepository, times(1)).save(testCodelist);
    }

    @Test
    public void updateNonExistingCodelist() throws Exception {
        int databaseSizeBeforeUpdate = codelistRepository.findAll().size();

        // Create the Codelist

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCodelistMockMvc.perform(put("/api/codelists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(codelist)))
            .andExpect(status().isBadRequest());

        // Validate the Codelist in the database
        List<Codelist> codelistList = codelistRepository.findAll();
        assertThat(codelistList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Codelist in Elasticsearch
        verify(mockCodelistSearchRepository, times(0)).save(codelist);
    }

    @Test
    public void deleteCodelist() throws Exception {
        // Initialize the database
        codelistService.createCodelist(codelist);

        int databaseSizeBeforeDelete = codelistRepository.findAll().size();

        // Get the codelist
        restCodelistMockMvc.perform(delete("/api/codelists/{id}", codelist.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Codelist> codelistList = codelistRepository.findAll();
        assertThat(codelistList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Codelist in Elasticsearch
        verify(mockCodelistSearchRepository, times(1)).deleteById(codelist.getId());
    }

    @Test
    public void searchCodelist() throws Exception {
        // Initialize the database
        codelistService.createCodelist(codelist);
        when(mockCodelistSearchRepository.search(queryStringQuery("id:" + codelist.getId())))
            .thenReturn(Collections.singletonList(codelist));
        // Search the codelist
        restCodelistMockMvc.perform(get("/api/_search/codelists?query=id:" + codelist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(codelist.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Codelist.class);
        Codelist codelist1 = new Codelist();
        codelist1.setId("id1");
        Codelist codelist2 = new Codelist();
        codelist2.setId(codelist1.getId());
        assertThat(codelist1).isEqualTo(codelist2);
        codelist2.setId("id2");
        assertThat(codelist1).isNotEqualTo(codelist2);
        codelist1.setId(null);
        assertThat(codelist1).isNotEqualTo(codelist2);
    }
}
