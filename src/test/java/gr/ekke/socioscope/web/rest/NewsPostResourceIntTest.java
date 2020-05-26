package gr.ekke.socioscope.web.rest;

import gr.ekke.socioscope.SocioscopeApp;

import gr.ekke.socioscope.domain.NewsPost;
import gr.ekke.socioscope.repository.NewsPostRepository;
import gr.ekke.socioscope.repository.search.NewsPostSearchRepository;
import gr.ekke.socioscope.service.NewsPostService;
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
import org.springframework.util.Base64Utils;

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
 * Test class for the NewsPostResource REST controller.
 *
 * @see NewsPostResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SocioscopeApp.class)
public class NewsPostResourceIntTest {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PREVIEW_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PREVIEW_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PREVIEW_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PREVIEW_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_PREVIEW_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_PREVIEW_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_PREVIEW_SUBTITLE = "AAAAAAAAAA";
    private static final String UPDATED_PREVIEW_SUBTITLE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_PUBLISHED = false;
    private static final Boolean UPDATED_PUBLISHED = true;

    private static final Instant DEFAULT_POST_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_POST_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private NewsPostRepository newsPostRepository;

    @Autowired
    private NewsPostService newsPostService;

    /**
     * This repository is mocked in the gr.ekke.socioscope.repository.search test package.
     *
     * @see gr.ekke.socioscope.repository.search.NewsPostSearchRepositoryMockConfiguration
     */
    @Autowired
    private NewsPostSearchRepository mockNewsPostSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restNewsPostMockMvc;

    private NewsPost newsPost;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NewsPostResource newsPostResource = new NewsPostResource(newsPostService);
        this.restNewsPostMockMvc = MockMvcBuilders.standaloneSetup(newsPostResource)
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
    public static NewsPost createEntity() {
        NewsPost newsPost = new NewsPost()
            .content(DEFAULT_CONTENT)
            .previewImage(DEFAULT_PREVIEW_IMAGE)
            .previewImageContentType(DEFAULT_PREVIEW_IMAGE_CONTENT_TYPE)
            .previewTitle(DEFAULT_PREVIEW_TITLE)
            .previewSubtitle(DEFAULT_PREVIEW_SUBTITLE)
            .published(DEFAULT_PUBLISHED)
            .postDate(DEFAULT_POST_DATE);
        return newsPost;
    }

    @Before
    public void initTest() {
        newsPostRepository.deleteAll();
        newsPost = createEntity();
    }

    @Test
    public void createNewsPost() throws Exception {
        int databaseSizeBeforeCreate = newsPostRepository.findAll().size();

        // Create the NewsPost
        restNewsPostMockMvc.perform(post("/api/news-posts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsPost)))
            .andExpect(status().isCreated());

        // Validate the NewsPost in the database
        List<NewsPost> newsPostList = newsPostRepository.findAll();
        assertThat(newsPostList).hasSize(databaseSizeBeforeCreate + 1);
        NewsPost testNewsPost = newsPostList.get(newsPostList.size() - 1);
        assertThat(testNewsPost.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testNewsPost.getPreviewImage()).isEqualTo(DEFAULT_PREVIEW_IMAGE);
        assertThat(testNewsPost.getPreviewImageContentType()).isEqualTo(DEFAULT_PREVIEW_IMAGE_CONTENT_TYPE);
        assertThat(testNewsPost.getPreviewTitle()).isEqualTo(DEFAULT_PREVIEW_TITLE);
        assertThat(testNewsPost.getPreviewSubtitle()).isEqualTo(DEFAULT_PREVIEW_SUBTITLE);
        assertThat(testNewsPost.isPublished()).isEqualTo(DEFAULT_PUBLISHED);
        assertThat(testNewsPost.getPostDate()).isEqualTo(DEFAULT_POST_DATE);

        // Validate the NewsPost in Elasticsearch
        verify(mockNewsPostSearchRepository, times(1)).save(testNewsPost);
    }

    @Test
    public void createNewsPostWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = newsPostRepository.findAll().size();

        // Create the NewsPost with an existing ID
        newsPost.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewsPostMockMvc.perform(post("/api/news-posts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsPost)))
            .andExpect(status().isBadRequest());

        // Validate the NewsPost in the database
        List<NewsPost> newsPostList = newsPostRepository.findAll();
        assertThat(newsPostList).hasSize(databaseSizeBeforeCreate);

        // Validate the NewsPost in Elasticsearch
        verify(mockNewsPostSearchRepository, times(0)).save(newsPost);
    }

    @Test
    public void getAllNewsPosts() throws Exception {
        // Initialize the database
        newsPostRepository.save(newsPost);

        // Get all the newsPostList
        restNewsPostMockMvc.perform(get("/api/news-posts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newsPost.getId())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].previewImageContentType").value(hasItem(DEFAULT_PREVIEW_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].previewImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_PREVIEW_IMAGE))))
            .andExpect(jsonPath("$.[*].previewTitle").value(hasItem(DEFAULT_PREVIEW_TITLE.toString())))
            .andExpect(jsonPath("$.[*].previewSubtitle").value(hasItem(DEFAULT_PREVIEW_SUBTITLE.toString())))
            .andExpect(jsonPath("$.[*].published").value(hasItem(DEFAULT_PUBLISHED.booleanValue())))
            .andExpect(jsonPath("$.[*].postDate").value(hasItem(DEFAULT_POST_DATE.toString())));
    }
    
    @Test
    public void getNewsPost() throws Exception {
        // Initialize the database
        newsPostRepository.save(newsPost);

        // Get the newsPost
        restNewsPostMockMvc.perform(get("/api/news-posts/{id}", newsPost.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(newsPost.getId()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.previewImageContentType").value(DEFAULT_PREVIEW_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.previewImage").value(Base64Utils.encodeToString(DEFAULT_PREVIEW_IMAGE)))
            .andExpect(jsonPath("$.previewTitle").value(DEFAULT_PREVIEW_TITLE.toString()))
            .andExpect(jsonPath("$.previewSubtitle").value(DEFAULT_PREVIEW_SUBTITLE.toString()))
            .andExpect(jsonPath("$.published").value(DEFAULT_PUBLISHED.booleanValue()))
            .andExpect(jsonPath("$.postDate").value(DEFAULT_POST_DATE.toString()));
    }

    @Test
    public void getNonExistingNewsPost() throws Exception {
        // Get the newsPost
        restNewsPostMockMvc.perform(get("/api/news-posts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateNewsPost() throws Exception {
        // Initialize the database
        newsPostService.save(newsPost);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockNewsPostSearchRepository);

        int databaseSizeBeforeUpdate = newsPostRepository.findAll().size();

        // Update the newsPost
        NewsPost updatedNewsPost = newsPostRepository.findById(newsPost.getId()).get();
        updatedNewsPost
            .content(UPDATED_CONTENT)
            .previewImage(UPDATED_PREVIEW_IMAGE)
            .previewImageContentType(UPDATED_PREVIEW_IMAGE_CONTENT_TYPE)
            .previewTitle(UPDATED_PREVIEW_TITLE)
            .previewSubtitle(UPDATED_PREVIEW_SUBTITLE)
            .published(UPDATED_PUBLISHED)
            .postDate(UPDATED_POST_DATE);

        restNewsPostMockMvc.perform(put("/api/news-posts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedNewsPost)))
            .andExpect(status().isOk());

        // Validate the NewsPost in the database
        List<NewsPost> newsPostList = newsPostRepository.findAll();
        assertThat(newsPostList).hasSize(databaseSizeBeforeUpdate);
        NewsPost testNewsPost = newsPostList.get(newsPostList.size() - 1);
        assertThat(testNewsPost.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testNewsPost.getPreviewImage()).isEqualTo(UPDATED_PREVIEW_IMAGE);
        assertThat(testNewsPost.getPreviewImageContentType()).isEqualTo(UPDATED_PREVIEW_IMAGE_CONTENT_TYPE);
        assertThat(testNewsPost.getPreviewTitle()).isEqualTo(UPDATED_PREVIEW_TITLE);
        assertThat(testNewsPost.getPreviewSubtitle()).isEqualTo(UPDATED_PREVIEW_SUBTITLE);
        assertThat(testNewsPost.isPublished()).isEqualTo(UPDATED_PUBLISHED);
        assertThat(testNewsPost.getPostDate()).isEqualTo(UPDATED_POST_DATE);

        // Validate the NewsPost in Elasticsearch
        verify(mockNewsPostSearchRepository, times(1)).save(testNewsPost);
    }

    @Test
    public void updateNonExistingNewsPost() throws Exception {
        int databaseSizeBeforeUpdate = newsPostRepository.findAll().size();

        // Create the NewsPost

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewsPostMockMvc.perform(put("/api/news-posts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(newsPost)))
            .andExpect(status().isBadRequest());

        // Validate the NewsPost in the database
        List<NewsPost> newsPostList = newsPostRepository.findAll();
        assertThat(newsPostList).hasSize(databaseSizeBeforeUpdate);

        // Validate the NewsPost in Elasticsearch
        verify(mockNewsPostSearchRepository, times(0)).save(newsPost);
    }

    @Test
    public void deleteNewsPost() throws Exception {
        // Initialize the database
        newsPostService.save(newsPost);

        int databaseSizeBeforeDelete = newsPostRepository.findAll().size();

        // Get the newsPost
        restNewsPostMockMvc.perform(delete("/api/news-posts/{id}", newsPost.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<NewsPost> newsPostList = newsPostRepository.findAll();
        assertThat(newsPostList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the NewsPost in Elasticsearch
        verify(mockNewsPostSearchRepository, times(1)).deleteById(newsPost.getId());
    }

    @Test
    public void searchNewsPost() throws Exception {
        // Initialize the database
        newsPostService.save(newsPost);
        when(mockNewsPostSearchRepository.search(queryStringQuery("id:" + newsPost.getId())))
            .thenReturn(Collections.singletonList(newsPost));
        // Search the newsPost
        restNewsPostMockMvc.perform(get("/api/_search/news-posts?query=id:" + newsPost.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newsPost.getId())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].previewImageContentType").value(hasItem(DEFAULT_PREVIEW_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].previewImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_PREVIEW_IMAGE))))
            .andExpect(jsonPath("$.[*].previewTitle").value(hasItem(DEFAULT_PREVIEW_TITLE)))
            .andExpect(jsonPath("$.[*].previewSubtitle").value(hasItem(DEFAULT_PREVIEW_SUBTITLE)))
            .andExpect(jsonPath("$.[*].published").value(hasItem(DEFAULT_PUBLISHED.booleanValue())))
            .andExpect(jsonPath("$.[*].postDate").value(hasItem(DEFAULT_POST_DATE.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewsPost.class);
        NewsPost newsPost1 = new NewsPost();
        newsPost1.setId("id1");
        NewsPost newsPost2 = new NewsPost();
        newsPost2.setId(newsPost1.getId());
        assertThat(newsPost1).isEqualTo(newsPost2);
        newsPost2.setId("id2");
        assertThat(newsPost1).isNotEqualTo(newsPost2);
        newsPost1.setId(null);
        assertThat(newsPost1).isNotEqualTo(newsPost2);
    }
}
