package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.search.DataSetSearchRepository;
import gr.ekke.socioscope.service.DataSetService;
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
 * Test class for the DataSetResource REST controller.
 *
 * @see DataSetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class DataSetResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    @Autowired
    private DataSetRepository dataSetRepository;

    @Autowired
    private DataSetService dataSetService;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.DataSetSearchRepositoryMockConfiguration
     */
    @Autowired
    private DataSetSearchRepository mockDataSetSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restDataSetMockMvc;

    private DataSet dataSet;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DataSetResource dataSetResource = new DataSetResource(dataSetService);
        this.restDataSetMockMvc = MockMvcBuilders.standaloneSetup(dataSetResource)
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
    public static DataSet createEntity() {
        DataSet dataSet = new DataSet()
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE)
            .comment(DEFAULT_COMMENT);
        return dataSet;
    }

    @Before
    public void initTest() {
        dataSetRepository.deleteAll();
        dataSet = createEntity();
    }

    @Test
    public void createDataSet() throws Exception {
        int databaseSizeBeforeCreate = dataSetRepository.findAll().size();

        // Create the DataSet
        restDataSetMockMvc.perform(post("/api/data-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataSet)))
            .andExpect(status().isCreated());

        // Validate the DataSet in the database
        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeCreate + 1);
        DataSet testDataSet = dataSetList.get(dataSetList.size() - 1);
        assertThat(testDataSet.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataSet.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testDataSet.getComment()).isEqualTo(DEFAULT_COMMENT);

        // Validate the DataSet in Elasticsearch
        verify(mockDataSetSearchRepository, times(1)).save(testDataSet);
    }

    @Test
    public void createDataSetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dataSetRepository.findAll().size();

        // Create the DataSet with an existing ID
        dataSet.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataSetMockMvc.perform(post("/api/data-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataSet)))
            .andExpect(status().isBadRequest());

        // Validate the DataSet in the database
        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeCreate);

        // Validate the DataSet in Elasticsearch
        verify(mockDataSetSearchRepository, times(0)).save(dataSet);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataSetRepository.findAll().size();
        // set the field null
        dataSet.setName(null);

        // Create the DataSet, which fails.

        restDataSetMockMvc.perform(post("/api/data-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataSet)))
            .andExpect(status().isBadRequest());

        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = dataSetRepository.findAll().size();
        // set the field null
        dataSet.setType(null);

        // Create the DataSet, which fails.

        restDataSetMockMvc.perform(post("/api/data-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataSet)))
            .andExpect(status().isBadRequest());

        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllDataSets() throws Exception {
        // Initialize the database
        dataSetRepository.save(dataSet);

        // Get all the dataSetList
        restDataSetMockMvc.perform(get("/api/data-sets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataSet.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }
    
    @Test
    public void getDataSet() throws Exception {
        // Initialize the database
        dataSetRepository.save(dataSet);

        // Get the dataSet
        restDataSetMockMvc.perform(get("/api/data-sets/{id}", dataSet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(dataSet.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()));
    }

    @Test
    public void getNonExistingDataSet() throws Exception {
        // Get the dataSet
        restDataSetMockMvc.perform(get("/api/data-sets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateDataSet() throws Exception {
        // Initialize the database
        dataSetService.create(dataSet);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockDataSetSearchRepository);

        int databaseSizeBeforeUpdate = dataSetRepository.findAll().size();

        // Update the dataSet
        DataSet updatedDataSet = dataSetRepository.findById(dataSet.getId()).get();
        updatedDataSet
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .comment(UPDATED_COMMENT);

        restDataSetMockMvc.perform(put("/api/data-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDataSet)))
            .andExpect(status().isOk());

        // Validate the DataSet in the database
        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeUpdate);
        DataSet testDataSet = dataSetList.get(dataSetList.size() - 1);
        assertThat(testDataSet.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataSet.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testDataSet.getComment()).isEqualTo(UPDATED_COMMENT);

        // Validate the DataSet in Elasticsearch
        verify(mockDataSetSearchRepository, times(1)).save(testDataSet);
    }

    @Test
    public void updateNonExistingDataSet() throws Exception {
        int databaseSizeBeforeUpdate = dataSetRepository.findAll().size();

        // Create the DataSet

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataSetMockMvc.perform(put("/api/data-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dataSet)))
            .andExpect(status().isBadRequest());

        // Validate the DataSet in the database
        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeUpdate);

        // Validate the DataSet in Elasticsearch
        verify(mockDataSetSearchRepository, times(0)).save(dataSet);
    }

    @Test
    public void deleteDataSet() throws Exception {
        // Initialize the database
        dataSetService.create(dataSet);

        int databaseSizeBeforeDelete = dataSetRepository.findAll().size();

        // Get the dataSet
        restDataSetMockMvc.perform(delete("/api/data-sets/{id}", dataSet.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DataSet> dataSetList = dataSetRepository.findAll();
        assertThat(dataSetList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the DataSet in Elasticsearch
        verify(mockDataSetSearchRepository, times(1)).deleteById(dataSet.getId());
    }

    @Test
    public void searchDataSet() throws Exception {
        // Initialize the database
        dataSetService.create(dataSet);
        when(mockDataSetSearchRepository.search(queryStringQuery("id:" + dataSet.getId())))
            .thenReturn(Collections.singletonList(dataSet));
        // Search the dataSet
        restDataSetMockMvc.perform(get("/api/_search/data-sets?query=id:" + dataSet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataSet.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataSet.class);
        DataSet dataSet1 = new DataSet();
        dataSet1.setId("id1");
        DataSet dataSet2 = new DataSet();
        dataSet2.setId(dataSet1.getId());
        assertThat(dataSet1).isEqualTo(dataSet2);
        dataSet2.setId("id2");
        assertThat(dataSet1).isNotEqualTo(dataSet2);
        dataSet1.setId(null);
        assertThat(dataSet1).isNotEqualTo(dataSet2);
    }
}
