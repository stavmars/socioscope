package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.DimensionCode;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the DimensionCode entity.
 */
public interface DimensionCodeSearchRepository extends ElasticsearchRepository<DimensionCode, String> {
}
