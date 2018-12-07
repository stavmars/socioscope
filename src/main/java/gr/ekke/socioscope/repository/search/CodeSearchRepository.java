package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.Code;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Code entity.
 */
public interface CodeSearchRepository extends ElasticsearchRepository<Code, String> {
}
