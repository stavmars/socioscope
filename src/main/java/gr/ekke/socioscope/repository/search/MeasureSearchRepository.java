package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.Measure;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Measure entity.
 */
public interface MeasureSearchRepository extends ElasticsearchRepository<Measure, String> {
}
