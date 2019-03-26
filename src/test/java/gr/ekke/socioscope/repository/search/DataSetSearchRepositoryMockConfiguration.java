package gr.ekke.socioscope.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of DataSetSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class DataSetSearchRepositoryMockConfiguration {

    @MockBean
    private DataSetSearchRepository mockDataSetSearchRepository;

}
