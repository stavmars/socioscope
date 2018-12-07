package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.Codelist;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Codelist entity.
 */
public interface CodelistSearchRepository extends ElasticsearchRepository<Codelist, String> {
}
