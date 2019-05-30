package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.repository.DimensionRepository;
import gr.ekke.socioscope.repository.search.DimensionSearchRepository;
import gr.ekke.socioscope.service.DimensionService;
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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import static gr.ekke.socioscope.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DimensionResource REST controller.
 *
 * @see DimensionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class DimensionResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    @Autowired
    private DimensionRepository dimensionRepository;

    @Autowired
    private DimensionService dimensionService;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.DimensionSearchRepositoryMockConfiguration
     */
    @Autowired
    private DimensionSearchRepository mockDimensionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restDimensionMockMvc;

    private Dimension dimension;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DimensionResource dimensionResource = new DimensionResource(dimensionService);
        this.restDimensionMockMvc = MockMvcBuilders.standaloneSetup(dimensionResource)
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
    public static Dimension createEntity() {
        Map<String, String> name = new HashMap<>();
        name.put(DEFAULT_NAME, DEFAULT_NAME);
        Dimension dimension = new Dimension()
            .name(name)
            .type(DEFAULT_TYPE);
        return dimension;
    }

    @Before
    public void initTest() {
        dimensionRepository.deleteAll();
        dimension = createEntity();
    }

    @Test
    public void createDimension() throws Exception {
        int databaseSizeBeforeCreate = dimensionRepository.findAll().size();

        // Create the Dimension
        restDimensionMockMvc.perform(post("/api/dimensions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimension)))
            .andExpect(status().isCreated());

        // Validate the Dimension in the database
        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeCreate + 1);
        Dimension testDimension = dimensionList.get(dimensionList.size() - 1);
        assertThat(testDimension.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDimension.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the Dimension in Elasticsearch
        verify(mockDimensionSearchRepository, times(1)).save(testDimension);
    }

    @Test
    public void createDimensionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dimensionRepository.findAll().size();

        // Create the Dimension with an existing ID
        dimension.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restDimensionMockMvc.perform(post("/api/dimensions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimension)))
            .andExpect(status().isBadRequest());

        // Validate the Dimension in the database
        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Dimension in Elasticsearch
        verify(mockDimensionSearchRepository, times(0)).save(dimension);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dimensionRepository.findAll().size();
        // set the field null
        dimension.setName(null);

        // Create the Dimension, which fails.

        restDimensionMockMvc.perform(post("/api/dimensions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimension)))
            .andExpect(status().isBadRequest());

        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = dimensionRepository.findAll().size();
        // set the field null
        dimension.setType(null);

        // Create the Dimension, which fails.

        restDimensionMockMvc.perform(post("/api/dimensions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimension)))
            .andExpect(status().isBadRequest());

        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllDimensions() throws Exception {
        // Initialize the database
        dimensionRepository.save(dimension);

        // Get all the dimensionList
        restDimensionMockMvc.perform(get("/api/dimensions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dimension.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }
    
    @Test
    public void getDimension() throws Exception {
        // Initialize the database
        dimensionRepository.save(dimension);

        // Get the dimension
        restDimensionMockMvc.perform(get("/api/dimensions/{id}", dimension.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dimension.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    public void getNonExistingDimension() throws Exception {
        // Get the dimension
        restDimensionMockMvc.perform(get("/api/dimensions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateDimension() throws Exception {
        // Initialize the database
        dimensionService.create(dimension);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockDimensionSearchRepository);

        int databaseSizeBeforeUpdate = dimensionRepository.findAll().size();

        Map<String, String> name = new HashMap<>();
        name.put(DEFAULT_NAME, DEFAULT_NAME);
        // Update the dimension
        Dimension updatedDimension = dimensionRepository.findById(dimension.getId()).get();
        updatedDimension
            .name(name)
            .type(UPDATED_TYPE);

        restDimensionMockMvc.perform(put("/api/dimensions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDimension)))
            .andExpect(status().isOk());

        // Validate the Dimension in the database
        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeUpdate);
        Dimension testDimension = dimensionList.get(dimensionList.size() - 1);
        assertThat(testDimension.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDimension.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the Dimension in Elasticsearch
        verify(mockDimensionSearchRepository, times(1)).save(testDimension);
    }

    @Test
    public void updateNonExistingDimension() throws Exception {
        int databaseSizeBeforeUpdate = dimensionRepository.findAll().size();

        // Create the Dimension

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDimensionMockMvc.perform(put("/api/dimensions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimension)))
            .andExpect(status().isBadRequest());

        // Validate the Dimension in the database
        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Dimension in Elasticsearch
        verify(mockDimensionSearchRepository, times(0)).save(dimension);
    }

    @Test
    public void deleteDimension() throws Exception {
        // Initialize the database
        dimensionService.create(dimension);

        int databaseSizeBeforeDelete = dimensionRepository.findAll().size();

        // Get the dimension
        restDimensionMockMvc.perform(delete("/api/dimensions/{id}", dimension.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Dimension> dimensionList = dimensionRepository.findAll();
        assertThat(dimensionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Dimension in Elasticsearch
        verify(mockDimensionSearchRepository, times(1)).deleteById(dimension.getId());
    }

    @Test
    public void searchDimension() throws Exception {
        // Initialize the database
        dimensionService.create(dimension);
        when(mockDimensionSearchRepository.search(queryStringQuery("id:" + dimension.getId())))
            .thenReturn(Collections.singletonList(dimension));
        // Search the dimension
        restDimensionMockMvc.perform(get("/api/_search/dimensions?query=id:" + dimension.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dimension.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Dimension.class);
        Dimension dimension1 = new Dimension();
        dimension1.setId("id1");
        Dimension dimension2 = new Dimension();
        dimension2.setId(dimension1.getId());
        assertThat(dimension1).isEqualTo(dimension2);
        dimension2.setId("id2");
        assertThat(dimension1).isNotEqualTo(dimension2);
        dimension1.setId(null);
        assertThat(dimension1).isNotEqualTo(dimension2);
    }
}
