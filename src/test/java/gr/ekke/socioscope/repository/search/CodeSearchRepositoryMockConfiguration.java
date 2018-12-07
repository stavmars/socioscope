package gr.ekke.socioscope.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of CodeSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CodeSearchRepositoryMockConfiguration {

    @MockBean
    private CodeSearchRepository mockCodeSearchRepository;

}
