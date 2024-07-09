package gr.ekke.socioscope.config.dbmigrations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.mongobee.changeset.ChangeLog;
import com.github.mongobee.changeset.ChangeSet;
import gr.ekke.socioscope.domain.*;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

/**
 * Migrates Socioscope data from migrate directory
 */
@ChangeLog(order = "002")
public class SocioscopeDataMigration {

    @ChangeSet(order = "01", author = "initiator", id = "addMeasures")
    public void addMeasures(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/measures.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<Measure> measures = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Measure.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Measure.class);
        bulkOperations.insert(measures);
        bulkOperations.execute();
    }

    @ChangeSet(order = "02", author = "initiator", id = "addDimensions")
    public void addDimensions(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/dimensions.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<Dimension> dimensions = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Dimension.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Dimension.class);
        bulkOperations.insert(dimensions);
        bulkOperations.execute();
    }

    @ChangeSet(order = "03", author = "initiator", id = "addDimensionCodes")
    public void addDimensionCodes(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        TypeFactory typeFactory = mapper.getTypeFactory();

        File codeDir = new File(environment.getProperty("application.migrate-data-path") + "/codes");
        List<File> files = (List<File>) FileUtils.listFiles(codeDir, new String[]{"json"}, false);
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, DimensionCode.class);

        for (File file : files) {
            List<DimensionCode> dimensionCodes = mapper.readValue(file, typeFactory.constructCollectionType(List.class, DimensionCode.class));
            bulkOperations.insert(dimensionCodes);
        }
        bulkOperations.execute();
    }

    @ChangeSet(order = "04", author = "initiator", id = "addDatasets")
    public void addDatasets(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/datasets.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<DataSet> datasets = mapper.readValue(file, typeFactory.constructCollectionType(List.class, DataSet.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, DataSet.class);
        bulkOperations.insert(datasets);
        bulkOperations.execute();
    }

    @ChangeSet(order = "05", author = "initiator", id = "addObservations")
    public void addObservations(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/observations.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<Observation> observations = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Observation.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Observation.class);
        bulkOperations.insert(observations);
        bulkOperations.execute();
    }

    @ChangeSet(order = "06", author = "initiator", id = "addDeputiesData")
    public void addDeputiesData(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/deputies.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List deputies = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Object.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Object.class, "deputies");
        bulkOperations.insert(deputies);
        bulkOperations.execute();
    }

    @ChangeSet(order = "07", author = "initiator", id = "addAdolescentsData")
    public void addAdolescentsData(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/adolescents.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List adolescents = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Object.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Object.class, "adolescents");
        bulkOperations.insert(adolescents);
        bulkOperations.execute();
    }

    @ChangeSet(order = "08", author = "initiator", id = "addClaimsData")
    public void addClaimsData(MongoTemplate mongoTemplate, Environment environment) throws IOException, ParseException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/claims.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<Map> claims = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Map.class));
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        for (Map claim : claims) {
            String aDate = (String) claim.get("ADATE");
            String cDate = (String) claim.get("CDATE");
            if (!StringUtils.isBlank(aDate)) {
                claim.put("ADATE", dateFormat.parse(aDate).toInstant());
            }
            if (!StringUtils.isBlank(cDate)) {
                claim.put("CDATE", dateFormat.parse(cDate).toInstant());
            }
        }
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Map.class, "claims");
        bulkOperations.insert(claims);
        bulkOperations.execute();
    }

    @ChangeSet(order = "09", author = "initiator", id="addYouWhoData")
    public void addYouWhoData(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/youwho.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List youwho = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Object.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Object.class, "youwho");
        bulkOperations.insert(youwho);
        bulkOperations.execute();
    }

    @ChangeSet(order = "10", author = "initiator", id = "addElections2015b")
    public void addElections2015b(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/2015b.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<Observation> observations = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Observation.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Observation.class);
        bulkOperations.insert(observations);
        bulkOperations.execute();
    }

    @ChangeSet(order = "11", author = "initiator", id = "addElections2019")
    public void addElections2019(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/2019.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List<Observation> observations = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Observation.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Observation.class);
        bulkOperations.insert(observations);
        bulkOperations.execute();
    }

    @ChangeSet(order = "12", author = "initiator", id = "addBlogPosts")
    public  void addBlogSpots(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/blogPosts.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        mapper.registerModule(javaTimeModule);
        List<BlogPost> blogPosts = mapper.readValue(file, typeFactory.constructCollectionType(List.class, BlogPost.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, BlogPost.class);
        bulkOperations.insert(blogPosts);
        bulkOperations.execute();
    }

    @ChangeSet(order = "13", author = "initiator", id="addYoungEuropeanData")
    public void addYoungEuropeanData(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/young-europeans.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List youngEuropeanData = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Object.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Object.class, "young-europeans");
        bulkOperations.insert(youngEuropeanData);
        bulkOperations.execute();
    }

    @ChangeSet(order = "14", author = "initiator", id="addDemocracyAtSchoolData")
    public void addDemocracyAtSchoolData(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/democracy-at-school.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List democracyAtSchoolData = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Object.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Object.class, "democracy-at-school");
        bulkOperations.insert(democracyAtSchoolData);
        bulkOperations.execute();
    }

    @ChangeSet(order = "15", author = "initiator", id="addMediaGenderRepData")
    public void addMediaGenderRepData(MongoTemplate mongoTemplate, Environment environment) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(environment.getProperty("application.migrate-data-path") + "/mgr_data.json");
        TypeFactory typeFactory = mapper.getTypeFactory();
        List data = mapper.readValue(file, typeFactory.constructCollectionType(List.class, Object.class));
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Object.class, "media-gender-rep");
        bulkOperations.insert(data);
        bulkOperations.execute();
    }

}
