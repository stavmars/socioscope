package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.DimensionCode;
import gr.ekke.socioscope.repository.DimensionCodeRepository;
import gr.ekke.socioscope.repository.search.DimensionCodeSearchRepository;
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
import java.util.List;


import static gr.ekke.socioscope.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DimensionCodeResource REST controller.
 *
 * @see DimensionCodeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class DimensionCodeResourceIntTest {

    private static final String DEFAULT_DIMENSION_ID = "AAAAAAAAAA";
    private static final String UPDATED_DIMENSION_ID = "BBBBBBBBBB";

    private static final String DEFAULT_NOTATION = "AAAAAAAAAA";
    private static final String UPDATED_NOTATION = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PARENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_PARENT_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    @Autowired
    private DimensionCodeRepository dimensionCodeRepository;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.DimensionCodeSearchRepositoryMockConfiguration
     */
    @Autowired
    private DimensionCodeSearchRepository mockDimensionCodeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restDimensionCodeMockMvc;

    private DimensionCode dimensionCode;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DimensionCodeResource dimensionCodeResource = new DimensionCodeResource(dimensionCodeRepository, mockDimensionCodeSearchRepository);
        this.restDimensionCodeMockMvc = MockMvcBuilders.standaloneSetup(dimensionCodeResource)
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
    public static DimensionCode createEntity() {
        DimensionCode dimensionCode = new DimensionCode()
            .dimensionId(DEFAULT_DIMENSION_ID)
            .notation(DEFAULT_NOTATION)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .parentId(DEFAULT_PARENT_ID)
            .order(DEFAULT_ORDER)
            .color(DEFAULT_COLOR);
        return dimensionCode;
    }

    @Before
    public void initTest() {
        dimensionCodeRepository.deleteAll();
        dimensionCode = createEntity();
    }

    @Test
    public void createDimensionCode() throws Exception {
        int databaseSizeBeforeCreate = dimensionCodeRepository.findAll().size();

        // Create the DimensionCode
        restDimensionCodeMockMvc.perform(post("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimensionCode)))
            .andExpect(status().isCreated());

        // Validate the DimensionCode in the database
        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeCreate + 1);
        DimensionCode testDimensionCode = dimensionCodeList.get(dimensionCodeList.size() - 1);
        assertThat(testDimensionCode.getDimensionId()).isEqualTo(DEFAULT_DIMENSION_ID);
        assertThat(testDimensionCode.getNotation()).isEqualTo(DEFAULT_NOTATION);
        assertThat(testDimensionCode.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDimensionCode.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDimensionCode.getParentId()).isEqualTo(DEFAULT_PARENT_ID);
        assertThat(testDimensionCode.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testDimensionCode.getColor()).isEqualTo(DEFAULT_COLOR);

        // Validate the DimensionCode in Elasticsearch
        verify(mockDimensionCodeSearchRepository, times(1)).save(testDimensionCode);
    }

    @Test
    public void createDimensionCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dimensionCodeRepository.findAll().size();

        // Create the DimensionCode with an existing ID
        dimensionCode.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restDimensionCodeMockMvc.perform(post("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimensionCode)))
            .andExpect(status().isBadRequest());

        // Validate the DimensionCode in the database
        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeCreate);

        // Validate the DimensionCode in Elasticsearch
        verify(mockDimensionCodeSearchRepository, times(0)).save(dimensionCode);
    }

    @Test
    public void checkDimensionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = dimensionCodeRepository.findAll().size();
        // set the field null
        dimensionCode.setDimensionId(null);

        // Create the DimensionCode, which fails.

        restDimensionCodeMockMvc.perform(post("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimensionCode)))
            .andExpect(status().isBadRequest());

        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkNotationIsRequired() throws Exception {
        int databaseSizeBeforeTest = dimensionCodeRepository.findAll().size();
        // set the field null
        dimensionCode.setNotation(null);

        // Create the DimensionCode, which fails.

        restDimensionCodeMockMvc.perform(post("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimensionCode)))
            .andExpect(status().isBadRequest());

        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dimensionCodeRepository.findAll().size();
        // set the field null
        dimensionCode.setName(null);

        // Create the DimensionCode, which fails.

        restDimensionCodeMockMvc.perform(post("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimensionCode)))
            .andExpect(status().isBadRequest());

        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllDimensionCodes() throws Exception {
        // Initialize the database
        dimensionCodeRepository.save(dimensionCode);

        // Get all the dimensionCodeList
        restDimensionCodeMockMvc.perform(get("/api/dimension-codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dimensionCode.getId())))
            .andExpect(jsonPath("$.[*].dimensionId").value(hasItem(DEFAULT_DIMENSION_ID.toString())))
            .andExpect(jsonPath("$.[*].notation").value(hasItem(DEFAULT_NOTATION.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].parentId").value(hasItem(DEFAULT_PARENT_ID.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())));
    }
    
    @Test
    public void getDimensionCode() throws Exception {
        // Initialize the database
        dimensionCodeRepository.save(dimensionCode);

        // Get the dimensionCode
        restDimensionCodeMockMvc.perform(get("/api/dimension-codes/{id}", dimensionCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dimensionCode.getId()))
            .andExpect(jsonPath("$.dimensionId").value(DEFAULT_DIMENSION_ID.toString()))
            .andExpect(jsonPath("$.notation").value(DEFAULT_NOTATION.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.parentId").value(DEFAULT_PARENT_ID.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR.toString()));
    }

    @Test
    public void getNonExistingDimensionCode() throws Exception {
        // Get the dimensionCode
        restDimensionCodeMockMvc.perform(get("/api/dimension-codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateDimensionCode() throws Exception {
        // Initialize the database
        dimensionCodeRepository.save(dimensionCode);

        int databaseSizeBeforeUpdate = dimensionCodeRepository.findAll().size();

        // Update the dimensionCode
        DimensionCode updatedDimensionCode = dimensionCodeRepository.findById(dimensionCode.getId()).get();
        updatedDimensionCode
            .dimensionId(UPDATED_DIMENSION_ID)
            .notation(UPDATED_NOTATION)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .parentId(UPDATED_PARENT_ID)
            .order(UPDATED_ORDER)
            .color(UPDATED_COLOR);

        restDimensionCodeMockMvc.perform(put("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDimensionCode)))
            .andExpect(status().isOk());

        // Validate the DimensionCode in the database
        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeUpdate);
        DimensionCode testDimensionCode = dimensionCodeList.get(dimensionCodeList.size() - 1);
        assertThat(testDimensionCode.getDimensionId()).isEqualTo(UPDATED_DIMENSION_ID);
        assertThat(testDimensionCode.getNotation()).isEqualTo(UPDATED_NOTATION);
        assertThat(testDimensionCode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDimensionCode.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDimensionCode.getParentId()).isEqualTo(UPDATED_PARENT_ID);
        assertThat(testDimensionCode.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testDimensionCode.getColor()).isEqualTo(UPDATED_COLOR);

        // Validate the DimensionCode in Elasticsearch
        verify(mockDimensionCodeSearchRepository, times(1)).save(testDimensionCode);
    }

    @Test
    public void updateNonExistingDimensionCode() throws Exception {
        int databaseSizeBeforeUpdate = dimensionCodeRepository.findAll().size();

        // Create the DimensionCode

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDimensionCodeMockMvc.perform(put("/api/dimension-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dimensionCode)))
            .andExpect(status().isBadRequest());

        // Validate the DimensionCode in the database
        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the DimensionCode in Elasticsearch
        verify(mockDimensionCodeSearchRepository, times(0)).save(dimensionCode);
    }

    @Test
    public void deleteDimensionCode() throws Exception {
        // Initialize the database
        dimensionCodeRepository.save(dimensionCode);

        int databaseSizeBeforeDelete = dimensionCodeRepository.findAll().size();

        // Get the dimensionCode
        restDimensionCodeMockMvc.perform(delete("/api/dimension-codes/{id}", dimensionCode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DimensionCode> dimensionCodeList = dimensionCodeRepository.findAll();
        assertThat(dimensionCodeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the DimensionCode in Elasticsearch
        verify(mockDimensionCodeSearchRepository, times(1)).deleteById(dimensionCode.getId());
    }

    @Test
    public void searchDimensionCode() throws Exception {
        // Initialize the database
        dimensionCodeRepository.save(dimensionCode);
        when(mockDimensionCodeSearchRepository.search(queryStringQuery("id:" + dimensionCode.getId())))
            .thenReturn(Collections.singletonList(dimensionCode));
        // Search the dimensionCode
        restDimensionCodeMockMvc.perform(get("/api/_search/dimension-codes?query=id:" + dimensionCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dimensionCode.getId())))
            .andExpect(jsonPath("$.[*].dimensionId").value(hasItem(DEFAULT_DIMENSION_ID)))
            .andExpect(jsonPath("$.[*].notation").value(hasItem(DEFAULT_NOTATION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].parentId").value(hasItem(DEFAULT_PARENT_ID)))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DimensionCode.class);
        DimensionCode dimensionCode1 = new DimensionCode();
        dimensionCode1.setId("id1");
        DimensionCode dimensionCode2 = new DimensionCode();
        dimensionCode2.setId(dimensionCode1.getId());
        assertThat(dimensionCode1).isEqualTo(dimensionCode2);
        dimensionCode2.setId("id2");
        assertThat(dimensionCode1).isNotEqualTo(dimensionCode2);
        dimensionCode1.setId(null);
        assertThat(dimensionCode1).isNotEqualTo(dimensionCode2);
    }
}
