package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.NewsPost;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the NewsPost entity.
 */
public interface NewsPostSearchRepository extends ElasticsearchRepository<NewsPost, String> {
}
