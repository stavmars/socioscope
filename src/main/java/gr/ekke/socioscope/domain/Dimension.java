package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
import org.bson.json.JsonParseException;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.IOException;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * A Dimension.
 */
@Document(collection = "dimension")
public class Dimension implements Serializable {

    private static final long serialVersionUID = 1L;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    Map<String, @NotBlank GeoMap> geoMaps;
    @Id
    private String id;
    @Size(min = 1)
    @Field("name")
    private Map<String, @NotBlank String> name;

    @Field("description")
    private Map<String, @NotBlank String> description;

    private Map<String, @NotBlank String> details;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String groupId;

    private String order;

    @NotNull
    @Field("type")
    private String type;
    @Field("dependencies")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> dependencies;
    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> composedOf;

    private Boolean disableAxis;

    private Boolean disableFilter;

    private Boolean disableCompareBy;

    private Boolean allowCompareCodes;

    private String filterWidget;

    private Boolean disableStacking;

    private Boolean required;

    private Map<String, @NotBlank String> noFilterText;

    private String parentDimensionId;

    private Boolean allowThreshold;

    private Boolean defaultGeoMapXAxis;

    private String geoMapDependency;

    private String defaultGeoMapKey;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Dimension() {
    }


    @JsonCreator
    public static Dimension create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper()
            .registerModule(new ParameterNamesModule())
            .registerModule(new Jdk8Module())
            .registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        Dimension dimension = null;
        dimension = mapper.readValue(jsonString, Dimension.class);
        return dimension;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public Dimension name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public Dimension description(Map<String, String> description) {
        this.description = description;
        return this;
    }

    public Map<String, String> getDetails() {
        return details;
    }

    public void setDetails(Map<String, String> details) {
        this.details = details;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Dimension type(String type) {
        this.type = type;
        return this;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public Dimension creator(User user) {
        this.creator = user;
        return this;
    }

    public List<String> getDependencies() {
        return dependencies;
    }

    public void setDependencies(List<String> dependencies) {
        this.dependencies = dependencies;
    }

    public Dimension dependencies(List<String> dependencies) {
        this.dependencies = dependencies;
        return this;
    }

    public Map<String, GeoMap> getGeoMaps() {
        return geoMaps;
    }

    public void setGeoMaps(Map<String, GeoMap> geoMaps) {
        this.geoMaps = geoMaps;
    }

    public List<String> getComposedOf() {
        return composedOf;
    }

    public void setComposedOf(List<String> composedOf) {
        this.composedOf = composedOf;
    }

    public Boolean getDisableAxis() {
        return disableAxis;
    }

    public void setDisableAxis(Boolean disableAxis) {
        this.disableAxis = disableAxis;
    }

    public Boolean getDisableFilter() {
        return disableFilter;
    }

    public void setDisableFilter(Boolean disableFilter) {
        this.disableFilter = disableFilter;
    }

    public Boolean getDisableCompareBy() {
        return disableCompareBy;
    }

    public void setDisableCompareBy(Boolean disableCompareBy) {
        this.disableCompareBy = disableCompareBy;
    }

    public Boolean getDisableStacking() {
        return disableStacking;
    }

    public void setDisableStacking(Boolean disableStacking) {
        this.disableStacking = disableStacking;
    }

    public Boolean getAllowCompareCodes() {
        return allowCompareCodes;
    }

    public void setAllowCompareCodes(Boolean allowCompareCodes) {
        this.allowCompareCodes = allowCompareCodes;
    }

    public String getFilterWidget() {
        return filterWidget;
    }

    public void setFilterWidget(String filterWidget) {
        this.filterWidget = filterWidget;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Map<String, String> getNoFilterText() {
        return noFilterText;
    }

    public void setNoFilterText(Map<String, String> noFilterText) {
        this.noFilterText = noFilterText;
    }

    public String getParentDimensionId() {
        return parentDimensionId;
    }

    public void setParentDimensionId(String parentDimensionId) {
        this.parentDimensionId = parentDimensionId;
    }

    public Boolean getAllowThreshold() {
        return allowThreshold;
    }

    public void setAllowThreshold(Boolean allowThreshold) {
        this.allowThreshold = allowThreshold;
    }


    public Boolean getDefaultGeoMapXAxis() {
        return defaultGeoMapXAxis;
    }

    public void setDefaultGeoMapXAxis(Boolean defaultGeoMapXAxis) {
        this.defaultGeoMapXAxis = defaultGeoMapXAxis;
    }

    public String getGeoMapDependency() {
        return geoMapDependency;
    }

    public void setGeoMapDependency(String geoMapDependency) {
        this.geoMapDependency = geoMapDependency;
    }


    public String getDefaultGeoMapKey() {
        return defaultGeoMapKey;
    }

    public void setDefaultGeoMapKey(String defaultGeoMapKey) {
        this.defaultGeoMapKey = defaultGeoMapKey;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Dimension dimension = (Dimension) o;
        if (dimension.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dimension.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Dimension{" +
            "geoMaps=" + geoMaps +
            ", id='" + id + '\'' +
            ", name=" + name +
            ", description=" + description +
            ", details=" + details +
            ", groupId='" + groupId + '\'' +
            ", order='" + order + '\'' +
            ", type='" + type + '\'' +
            ", dependencies=" + dependencies +
            ", creator=" + creator +
            ", composedOf=" + composedOf +
            ", disableAxis=" + disableAxis +
            ", disableFilter=" + disableFilter +
            ", disableCompareBy=" + disableCompareBy +
            ", filterWidget='" + filterWidget + '\'' +
            ", disableStacking=" + disableStacking +
            ", required=" + required +
            ", noFilterText=" + noFilterText +
            ", parentDimensionId='" + parentDimensionId + '\'' +
            ", allowThreshold='" + allowThreshold + '\'' +
            ", defaultGeoMapXAxis='" + defaultGeoMapXAxis + '\'' +
            ", defaultGeoMapKey='" + defaultGeoMapKey + '\'' +
            '}';
    }
}
