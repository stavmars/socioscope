package gr.ekke.socioscope.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of CodelistSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CodelistSearchRepositoryMockConfiguration {

    @MockBean
    private CodelistSearchRepository mockCodelistSearchRepository;

}
