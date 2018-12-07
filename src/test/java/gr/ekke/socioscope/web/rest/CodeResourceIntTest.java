package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.Code;
import gr.ekke.socioscope.repository.CodeRepository;
import gr.ekke.socioscope.repository.search.CodeSearchRepository;
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
 * Test class for the CodeResource REST controller.
 *
 * @see CodeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class CodeResourceIntTest {

    private static final String DEFAULT_CODELIST_ID = "AAAAAAAAAA";
    private static final String UPDATED_CODELIST_ID = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PARENT_CODE_ID = "AAAAAAAAAA";
    private static final String UPDATED_PARENT_CODE_ID = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    @Autowired
    private CodeRepository codeRepository;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.CodeSearchRepositoryMockConfiguration
     */
    @Autowired
    private CodeSearchRepository mockCodeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restCodeMockMvc;

    private Code code;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CodeResource codeResource = new CodeResource(codeRepository, mockCodeSearchRepository);
        this.restCodeMockMvc = MockMvcBuilders.standaloneSetup(codeResource)
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
    public static Code createEntity() {
        Code code = new Code()
            .codelistId(DEFAULT_CODELIST_ID)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .parentCodeId(DEFAULT_PARENT_CODE_ID)
            .order(DEFAULT_ORDER)
            .color(DEFAULT_COLOR);
        return code;
    }

    @Before
    public void initTest() {
        codeRepository.deleteAll();
        code = createEntity();
    }

    @Test
    public void createCode() throws Exception {
        int databaseSizeBeforeCreate = codeRepository.findAll().size();

        // Create the Code
        restCodeMockMvc.perform(post("/api/codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(code)))
            .andExpect(status().isCreated());

        // Validate the Code in the database
        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeCreate + 1);
        Code testCode = codeList.get(codeList.size() - 1);
        assertThat(testCode.getCodelistId()).isEqualTo(DEFAULT_CODELIST_ID);
        assertThat(testCode.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCode.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCode.getParentCodeId()).isEqualTo(DEFAULT_PARENT_CODE_ID);
        assertThat(testCode.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testCode.getColor()).isEqualTo(DEFAULT_COLOR);

        // Validate the Code in Elasticsearch
        verify(mockCodeSearchRepository, times(1)).save(testCode);
    }

    @Test
    public void createCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = codeRepository.findAll().size();

        // Create the Code with an existing ID
        code.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restCodeMockMvc.perform(post("/api/codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(code)))
            .andExpect(status().isBadRequest());

        // Validate the Code in the database
        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Code in Elasticsearch
        verify(mockCodeSearchRepository, times(0)).save(code);
    }

    @Test
    public void checkCodelistIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = codeRepository.findAll().size();
        // set the field null
        code.setCodelistId(null);

        // Create the Code, which fails.

        restCodeMockMvc.perform(post("/api/codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(code)))
            .andExpect(status().isBadRequest());

        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = codeRepository.findAll().size();
        // set the field null
        code.setName(null);

        // Create the Code, which fails.

        restCodeMockMvc.perform(post("/api/codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(code)))
            .andExpect(status().isBadRequest());

        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllCodes() throws Exception {
        // Initialize the database
        codeRepository.save(code);

        // Get all the codeList
        restCodeMockMvc.perform(get("/api/codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(code.getId())))
            .andExpect(jsonPath("$.[*].codelistId").value(hasItem(DEFAULT_CODELIST_ID.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].parentCodeId").value(hasItem(DEFAULT_PARENT_CODE_ID.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())));
    }
    
    @Test
    public void getCode() throws Exception {
        // Initialize the database
        codeRepository.save(code);

        // Get the code
        restCodeMockMvc.perform(get("/api/codes/{id}", code.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(code.getId()))
            .andExpect(jsonPath("$.codelistId").value(DEFAULT_CODELIST_ID.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.parentCodeId").value(DEFAULT_PARENT_CODE_ID.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR.toString()));
    }

    @Test
    public void getNonExistingCode() throws Exception {
        // Get the code
        restCodeMockMvc.perform(get("/api/codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateCode() throws Exception {
        // Initialize the database
        codeRepository.save(code);

        int databaseSizeBeforeUpdate = codeRepository.findAll().size();

        // Update the code
        Code updatedCode = codeRepository.findById(code.getId()).get();
        updatedCode
            .codelistId(UPDATED_CODELIST_ID)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .parentCodeId(UPDATED_PARENT_CODE_ID)
            .order(UPDATED_ORDER)
            .color(UPDATED_COLOR);

        restCodeMockMvc.perform(put("/api/codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCode)))
            .andExpect(status().isOk());

        // Validate the Code in the database
        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeUpdate);
        Code testCode = codeList.get(codeList.size() - 1);
        assertThat(testCode.getCodelistId()).isEqualTo(UPDATED_CODELIST_ID);
        assertThat(testCode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCode.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCode.getParentCodeId()).isEqualTo(UPDATED_PARENT_CODE_ID);
        assertThat(testCode.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testCode.getColor()).isEqualTo(UPDATED_COLOR);

        // Validate the Code in Elasticsearch
        verify(mockCodeSearchRepository, times(1)).save(testCode);
    }

    @Test
    public void updateNonExistingCode() throws Exception {
        int databaseSizeBeforeUpdate = codeRepository.findAll().size();

        // Create the Code

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCodeMockMvc.perform(put("/api/codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(code)))
            .andExpect(status().isBadRequest());

        // Validate the Code in the database
        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Code in Elasticsearch
        verify(mockCodeSearchRepository, times(0)).save(code);
    }

    @Test
    public void deleteCode() throws Exception {
        // Initialize the database
        codeRepository.save(code);

        int databaseSizeBeforeDelete = codeRepository.findAll().size();

        // Get the code
        restCodeMockMvc.perform(delete("/api/codes/{id}", code.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Code> codeList = codeRepository.findAll();
        assertThat(codeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Code in Elasticsearch
        verify(mockCodeSearchRepository, times(1)).deleteById(code.getId());
    }

    @Test
    public void searchCode() throws Exception {
        // Initialize the database
        codeRepository.save(code);
        when(mockCodeSearchRepository.search(queryStringQuery("id:" + code.getId())))
            .thenReturn(Collections.singletonList(code));
        // Search the code
        restCodeMockMvc.perform(get("/api/_search/codes?query=id:" + code.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(code.getId())))
            .andExpect(jsonPath("$.[*].codelistId").value(hasItem(DEFAULT_CODELIST_ID)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].parentCodeId").value(hasItem(DEFAULT_PARENT_CODE_ID)))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Code.class);
        Code code1 = new Code();
        code1.setId("id1");
        Code code2 = new Code();
        code2.setId(code1.getId());
        assertThat(code1).isEqualTo(code2);
        code2.setId("id2");
        assertThat(code1).isNotEqualTo(code2);
        code1.setId(null);
        assertThat(code1).isNotEqualTo(code2);
    }
}
