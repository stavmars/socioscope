package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.repository.MeasureRepository;
import gr.ekke.socioscope.repository.search.MeasureSearchRepository;
import gr.ekke.socioscope.service.MeasureService;
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
 * Test class for the MeasureResource REST controller.
 *
 * @see MeasureResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class MeasureResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_UNIT = "AAAAAAAAAA";
    private static final String UPDATED_UNIT = "BBBBBBBBBB";

    @Autowired
    private MeasureRepository measureRepository;

    @Autowired
    private MeasureService measureService;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.MeasureSearchRepositoryMockConfiguration
     */
    @Autowired
    private MeasureSearchRepository mockMeasureSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restMeasureMockMvc;

    private Measure measure;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MeasureResource measureResource = new MeasureResource(measureService);
        this.restMeasureMockMvc = MockMvcBuilders.standaloneSetup(measureResource)
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
    public static Measure createEntity() {
        Map<String, String> name = new HashMap<>();
        name.put(DEFAULT_NAME, DEFAULT_NAME);
        Measure measure = new Measure()
            .name(name)
            .unit(DEFAULT_UNIT);
        return measure;
    }

    @Before
    public void initTest() {
        measureRepository.deleteAll();
        measure = createEntity();
    }

    @Test
    public void createMeasure() throws Exception {
        int databaseSizeBeforeCreate = measureRepository.findAll().size();

        // Create the Measure
        restMeasureMockMvc.perform(post("/api/measures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isCreated());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeCreate + 1);
        Measure testMeasure = measureList.get(measureList.size() - 1);
        assertThat(testMeasure.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMeasure.getUnit()).isEqualTo(DEFAULT_UNIT);

        // Validate the Measure in Elasticsearch
        verify(mockMeasureSearchRepository, times(1)).save(testMeasure);
    }

    @Test
    public void createMeasureWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = measureRepository.findAll().size();

        // Create the Measure with an existing ID
        measure.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restMeasureMockMvc.perform(post("/api/measures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeCreate);

        // Validate the Measure in Elasticsearch
        verify(mockMeasureSearchRepository, times(0)).save(measure);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = measureRepository.findAll().size();
        // set the field null
        measure.setName(null);

        // Create the Measure, which fails.

        restMeasureMockMvc.perform(post("/api/measures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isBadRequest());

        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkUnitIsRequired() throws Exception {
        int databaseSizeBeforeTest = measureRepository.findAll().size();
        // set the field null
        measure.setUnit(null);

        // Create the Measure, which fails.

        restMeasureMockMvc.perform(post("/api/measures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isBadRequest());

        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllMeasures() throws Exception {
        // Initialize the database
        measureRepository.save(measure);

        // Get all the measureList
        restMeasureMockMvc.perform(get("/api/measures?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(measure.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())));
    }
    
    @Test
    public void getMeasure() throws Exception {
        // Initialize the database
        measureRepository.save(measure);

        // Get the measure
        restMeasureMockMvc.perform(get("/api/measures/{id}", measure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(measure.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()));
    }

    @Test
    public void getNonExistingMeasure() throws Exception {
        // Get the measure
        restMeasureMockMvc.perform(get("/api/measures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateMeasure() throws Exception {
        // Initialize the database
        measureService.create(measure);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockMeasureSearchRepository);

        int databaseSizeBeforeUpdate = measureRepository.findAll().size();

        Map<String, String> name = new HashMap<>();
        name.put(DEFAULT_NAME, DEFAULT_NAME);
        // Update the measure
        Measure updatedMeasure = measureRepository.findById(measure.getId()).get();
        updatedMeasure
            .name(name)
            .unit(UPDATED_UNIT);

        restMeasureMockMvc.perform(put("/api/measures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMeasure)))
            .andExpect(status().isOk());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
        Measure testMeasure = measureList.get(measureList.size() - 1);
        assertThat(testMeasure.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeasure.getUnit()).isEqualTo(UPDATED_UNIT);

        // Validate the Measure in Elasticsearch
        verify(mockMeasureSearchRepository, times(1)).save(testMeasure);
    }

    @Test
    public void updateNonExistingMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();

        // Create the Measure

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeasureMockMvc.perform(put("/api/measures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Measure in Elasticsearch
        verify(mockMeasureSearchRepository, times(0)).save(measure);
    }

    @Test
    public void deleteMeasure() throws Exception {
        // Initialize the database
        measureService.create(measure);

        int databaseSizeBeforeDelete = measureRepository.findAll().size();

        // Get the measure
        restMeasureMockMvc.perform(delete("/api/measures/{id}", measure.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Measure in Elasticsearch
        verify(mockMeasureSearchRepository, times(1)).deleteById(measure.getId());
    }

    @Test
    public void searchMeasure() throws Exception {
        // Initialize the database
        measureService.create(measure);
        when(mockMeasureSearchRepository.search(queryStringQuery("id:" + measure.getId())))
            .thenReturn(Collections.singletonList(measure));
        // Search the measure
        restMeasureMockMvc.perform(get("/api/_search/measures?query=id:" + measure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(measure.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Measure.class);
        Measure measure1 = new Measure();
        measure1.setId("id1");
        Measure measure2 = new Measure();
        measure2.setId(measure1.getId());
        assertThat(measure1).isEqualTo(measure2);
        measure2.setId("id2");
        assertThat(measure1).isNotEqualTo(measure2);
        measure1.setId(null);
        assertThat(measure1).isNotEqualTo(measure2);
    }
}
