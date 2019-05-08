package gr.ekke.socioscope.repository.search;

import gr.ekke.socioscope.domain.DataSet;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the DataSet entity.
 */
public interface DataSetSearchRepository extends ElasticsearchRepository<DataSet, String> {
}
