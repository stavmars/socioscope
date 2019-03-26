package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.Dimension;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Dimension entity.
 */
public interface DimensionSearchRepository extends ElasticsearchRepository<Dimension, String> {
}
