package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Map;

public class GeoMap implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank
    private Map<String, @NotBlank String> name;

    private String url;

    public GeoMap() {
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return "GeoMap{" +
            ", name=" + name +
            ", url='" + url + '\'' +
            '}';
    }
}
