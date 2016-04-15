package org.ryang.todos;

import com.amazonaws.service.apigateway.importer.ApiImporterMain;
import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;

import java.util.List;

public class ImportApiCommand {
    private static final Log LOG = LogFactory.getLog(ApiImporterMain.class);
    private static final String CMD_NAME = "aws-api-import";

    @Parameter(names = {"--update", "-u"}, description = "API ID to import swagger into an existing API")
    private String apiId;

    @Parameter(names = {"--create", "-c"}, description = "Create a new API")
    private boolean createNew;

    @Parameter(description = "Path to API definition file to import")
    private List<String> files;

    @Parameter(names = {"--deploy", "-d"}, description = "Stage used to deploy the API (optional)")
    private String deploymentLabel;

    @Parameter(names = {"--test", "-t"}, description = "Delete the API after import (create only)")
    private boolean cleanup = false;

    @Parameter(names = {"--region", "-r"}, description = "AWS region to use (optional)")
    private String region;

    @Parameter(names = {"--profile", "-p"}, description = "AWS CLI profile to use (optional)")
    private String profile = "default";

    @Parameter(names = {"--raml-config"}, description = "RAML file for API Gateway metadata (optional)")
    private String configFile;

    @Parameter(names = "--help", help = true)
    private boolean help;

    public static void main(String[] args) {
//        SwaggerApiFileImporter importer = new ApiGatewaySwaggerFileImporter(new SwaggerParser(), new ApiGatewaySdkSwaggerApiImporter());
//
//        importer.importApi("api/definitions/");


        bootstrap();
        ApiImporterMain main = new ApiImporterMain();
        JCommander jCommander = new JCommander(main, args);
        jCommander.setProgramName(CMD_NAME);
        main.execute(jCommander);
    }

    static void bootstrap() {
        Logger root = Logger.getRootLogger();
        root.setLevel(Level.INFO);
        root.addAppender(new ConsoleAppender(new PatternLayout("%d %p - %m%n")));
    }

}
