var documenterSearchIndex = {"docs":
[{"location":"#DeIdentification.jl-1","page":"Home","title":"DeIdentification.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"A Julia package for de-identifying CSV data sets.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"pages = [\n    \"Guide\" => \"usage.md\",\n    \"API\" => \"documentation.md\"\n    ]","category":"page"},{"location":"#Quick-Notes:-1","page":"Home","title":"Quick Notes:","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Compatible with julia 0.7 and above\nIn your directory make sure to have the following sub-directories:\nlogs\noutput\nAll of the CSVs to be de-identified must contain a common identifier for the unit of analysis (e.g. patient ID)\nA config YAML file is required to run the pipeline","category":"page"},{"location":"usage/#Usage-Guide-1","page":"Guide","title":"Usage Guide","text":"","category":"section"},{"location":"usage/#DeIdentification-Methods-1","page":"Guide","title":"DeIdentification Methods","text":"","category":"section"},{"location":"usage/#","page":"Guide","title":"Guide","text":"Data can be processed in several different ways depending on the desired output","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"Dropped: drop the column as it is not needed for analysis or as identifier\nHashed: obfuscate the data in the column, but maintain referential integrity for joining data\nHashed and Salted: obfuscate the data in the column, but do not maintain referential integrity for joining data (useful for columns that would only be needed in re-identifying data)\nDate Shifted: Shift date or datetime columns by a random value (all date/times related to the primary identifier will be shifted by the same random number), optionally add a static year value to all dates\nNothing: columns are not identifying data and do not need to be obfuscated","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"Data can also be transformed before or after deidentification","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"Preprocess: before deidentification (e.g. hash), transform the data (e.g. make sure zip codes are 5 digit)\nPostprocess: after deidentficiation (e.g. dateshift) transform the data (e.g. only include the year of the date)","category":"page"},{"location":"usage/#Config-YAML-1","page":"Guide","title":"Config YAML","text":"","category":"section"},{"location":"usage/#","page":"Guide","title":"Guide","text":"To indicate how to de-identify the data, where the data lives, and other variables a configuration YAML file must be created by the user. There is a build_config utility function which can walk a user through file creation for the basic deidentification methods.  Pre- and post- processing must be manually added to the .yml file.   It's possible to combine different datasets in the same config file, each dataset will follow the set of rules defined in the dataset block. In addition, multiple files of the same dataset can be processed at the same time by using Glob patterns in the filename field instead of the full file path.","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"# config.yml\nproject:                <project name> # required\nproject_seed:           <int>          # optional, but required for reproducibility\nlog_path:               <dir path>     # required, must already be created\nmax_dateshift_days:     <int>          # optional, default is 30\ndateshift_years:        <int>          # optional, default is 0\noutput_path:            <dir path>     # required, must already be created\n\n# The primary ID must be present in all data sets, so that date shifting and salting work appropriately\nprimary_id: <column name>       # required\n\n# Default date format is \"y/m/d H:M:S\" (e.g. 1999/05/21 11:23:56) - see Dates.DateFormat for options\ndate_format: <Dates.DateFormat>\n\n# 1 to n datasets must be present to de-identify\ndatasets:\n  - name: <dataset name 1>          # required, used to name output file\n    filename: <file path / glob pattern>         # required, path for input CSV, or Glob pattern for input files in folder.\n    rename_cols:                  # optional, useful if columns used in joining have different names, renaming occurs before any other processing\n      - in: <col name 1a>                # required, current column name\n        out: <col name 1b>               # required, future column name\n    # NOTE: VAL must be used to indicate the field value being transformed - no matter the field's type, VAL will be processed as a string\n    preprocess_cols:\n      - col: <col name>\n        transform: <expression>\n    hash_cols:                    # optional, columns to be hashed\n      - <col name 1>\n      - <col name 2>\n    dateshift_cols:               # optional, columns to be dateshifted\n      - <col name 1>\n      - <col name 2>\n    salt_cols:                    # optional, columns to be hashed and salted\n      - <col name 1>\n      - <col name 2>\n    drop_cols:                    # optional, columns to be excluded from the de-identified data set\n      - <col name 1>\n      - <col name 2>\n    # NOTE: VAL must be used to indicate the field value being transformed - no matter the field's type, VAL will be processed as a string\n    postprocess_cols:\n      - col: <col name>\n        transform: <expression>\n  - name: <dataset name 2>          # required, used to name output file\n    filename: <file path / glob pattern>         # required, path for input CSV, or Glob pattern for input files in folder.\n    rename_cols:                  # optional, useful if columns used in joining have different names, renaming occurs before any other processing\n      - in: <col name 1a>                # required, current column name\n        out: <col name 1b>               # required, future column name\n    hash_cols:                    # optional, columns to be hashed\n      - <col name 1>\n      - <col name 2>\n    dateshift_cols:               # optional, columns to be dateshifted\n      - <col name 1>\n      - <col name 2>\n    salt_cols:                    # optional, columns to be hashed and salted\n      - <col name 1>\n      - <col name 2>\n    drop_cols:                    # optional, columns to be excluded from the de-identified data set\n      - <col name 1>\n      - <col name 2>","category":"page"},{"location":"usage/#Example-Config-1","page":"Guide","title":"Example Config","text":"","category":"section"},{"location":"usage/#","page":"Guide","title":"Guide","text":"project:                \"ehr\"\nproject_seed:           42          # for reproducibility\nlog_path:               \"./logs\"\nmax_dateshift_days:     30\ndateshift_years:        100\noutput_path:            \"./output\"\n\n# The primary ID must be present in all data sets, so that dateshifting and salting works appropriately\nprimary_id: \"CSN\"\n\n# Default date format is \"y/m/d H:M:S\" (e.g. 1999/05/21 11:23:56) - see Dates.DateFormat for options\ndate_format: \"y-m-dTH:M:S.s\"\n\ndatasets:\n  - name: dx\n    filename: \"./data/dx_files/*\" # Glob pattern option\n    rename_cols:\n      - in: \"EncounterBrownCSN\"\n        out: \"CSN\"\n    hash_cols:\n      - \"CSN\"\n      - \"PatientPrimaryMRN\"\n    dateshift_cols:\n      - \"ArrivalDateandTime\"\n    drop_cols:\n      - \"DiagnosisTerminologyType\"\n  - name: pat\n    filename: \"./data/pat.csv\"\n    # NOTE: renaming happens before any other operations (pre-processing, hashing, salting, dropping, dateshifting, post-processing)\n    rename_cols:\n      - in: \"EncounterBrownCSN\"\n        out: \"CSN\"\n      - in: \"PatientLastName\"\n        out: \"last_name\"\n    # NOTE: VAL must be used to indicate the field value being transformed - no matter the field's type, VAL will be processed as a string\n    preprocess_cols:\n      - col: \"PatientPostalCode\"\n        transform: \"getindex(VAL, 1:5)\"\n    hash_cols:\n      - \"CSN\"\n      - \"PatientPostalCode\"\n    salt_cols:\n      - \"last_name\"\n    dateshift_cols:\n      - \"ArrivalDateandTime\"\n      - \"DepartureDateandTime\"\n      - \"PatientBirthDate\"\n    # NOTE: VAL must be used to indicate the field value being transformed - no matter the field's type, VAL will be processed as a string\n    postprocess_cols:\n      - col: \"PatientBirthDate\"\n        transform: \"max(2000+100, parse(Int, getindex(VAL, 1:4)))\"\n  - name: med\n    filename: \"./data/med.csv\"\n    rename_cols:\n      - in: \"EncounterBrownCSN\"\n        out: \"CSN\"\n    hash_cols:\n      - \"CSN\"\n    dateshift_cols:\n      - \"ArrivalDateandTime\"\n    drop_cols:\n      - \"MedicationTherapeuticClass\"","category":"page"},{"location":"usage/#Running-the-Pipeline-1","page":"Guide","title":"Running the Pipeline","text":"","category":"section"},{"location":"usage/#","page":"Guide","title":"Guide","text":"To de-identify a data set, pass the config YAML to the deidentify function.","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"deidentify(\"./config.yml\")","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"This will read in the data, de-identify the data, write a log to file, and write the resulting data set to file.","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"The pipeline consists of three main steps:","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"Read the configuration file and process the settings\nDe-identify and write the data set\nWrite the dictionaries with salts, dateshift values, and research IDs to files","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"The deidentify function runs the three steps:","category":"page"},{"location":"usage/#","page":"Guide","title":"Guide","text":"proj_config = DeIdConfig(cfg_file)\ndeid = DeIdentified(proj_config)","category":"page"},{"location":"documentation/#API-Reference-1","page":"API","title":"API Reference","text":"","category":"section"},{"location":"documentation/#","page":"API","title":"API","text":"Modules = [DeIdentification]","category":"page"},{"location":"documentation/#DeIdentification.DeIdDicts-Tuple{Any,Any}","page":"API","title":"DeIdentification.DeIdDicts","text":"DeIdDicts(maxdays)\n\nStructure containing dictionaries for project level mappings\n\nPrimary ID -> Research ID\nResearch ID -> DateShift number of days\nResearch ID -> Salt value\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.ProjectConfig-Tuple{String}","page":"API","title":"DeIdentification.ProjectConfig","text":"ProjectConfig(config_file::String)\n\nStructure containing configuration information for project level information in the configuration YAML file.  This includes an array containing the FileConfig structures for dataset level information.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.build_config-Tuple{String,String}","page":"API","title":"DeIdentification.build_config","text":"build_config(data_dir::String, config_file::String)\n\nInteractively guides user through writing a configuration YAML file for DeIdentification. The datadir should contain one of each type of dataset you expect to deidentify (e.g. the data directory ./test/data' contains pat.csv, med.csv, and dx.csv). The config builder reads the headers of each CSV file and iteratively asks about the output name and deidentification type of each column. The results are written to `configfile`.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.build_config_from_csv-Tuple{String,String}","page":"API","title":"DeIdentification.build_config_from_csv","text":"build_config_from_csv(project_name::String, file::String)\n\nGenerates a configuration YAML file from a CSV file that defines the mappings. The CSV file needs to have at least three named columns, one called \"Source Table\" which defines the name of the CSV file the data will be read from, a second called \"Field\" which defines the name of the field in the data source and a final column called \"Method\" which contains the method to apply (one of \"Hash - Research ID\", \"Hash\", \"Hash & Salt\", \"Date Shift\", or \"Drop\").\n\nAny column renames and pre- or post-processing will need to be added manually to the file.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.deidentify-Tuple{ProjectConfig}","page":"API","title":"DeIdentification.deidentify","text":"deidentify(cfg::ProjectConfig)\n\nThis is the constructor for the DeIdentified struct. We use this type to store arrays of DeIdDataFrame variables, while also keeping a common salt_dict and dateshift_dict between DeIdDataFrames. The salt_dict allows us to track what salt was used on what cleartext. This is only necessary in the case of doing re-identification. The id_dict argument is a dictionary containing the hash digest of the original primary ID to our new research IDs.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.deidentify-Tuple{String}","page":"API","title":"DeIdentification.deidentify","text":"deidentify(config_path)\n\nRun entire pipeline: Processes configuration YAML file, de-identifies the data, and writes the data to disk.  Returns the dictionaries containing the mappings.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.FileConfig","page":"API","title":"DeIdentification.FileConfig","text":"FileConfig(name, filename, colmap, rename_cols)\n\nStructure containing configuration information for each datset in the configuration YAML file.  The colmap contains mapping of column names to their deidentification action (e.g. hash, salt, drop).\n\n\n\n\n\n","category":"type"},{"location":"documentation/#DeIdentification.dateshift_val!-Tuple{DeIdDicts,Union{Missing, Date, DateTime},Int64}","page":"API","title":"DeIdentification.dateshift_val!","text":"dateshift_val!(dicts, val, pid)\n\nDateshift fields containing dates. Dates are shifted by a maximum number of days specified in the project config.  All of the dates for the same primary key are shifted the same number of days. Of note is that missing values are left missing.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.deid_file!-Tuple{DeIdDicts,DeIdentification.FileConfig,ProjectConfig,Any}","page":"API","title":"DeIdentification.deid_file!","text":"deid_file!(dicts, file_config, project_config, logger)\n\nReads raw file and deidentifies per file configuration and project configurationg. Writes the deidentified data to a CSV file and updates the global dictionaries tracking identifier mappings.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.getcurrentdate-Tuple{}","page":"API","title":"DeIdentification.getcurrentdate","text":"getcurrentdate()\n\nReturns the current date as a string conforming to ISO8601 basic format.\n\nThis is used to generate filenames in a cross-platform compatible way.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.hash_salt_val!-Tuple{DeIdDicts,Any,Int64}","page":"API","title":"DeIdentification.hash_salt_val!","text":"hash_salt_val!(dicts, val, pid)\n\nSalt and hash fields containing unique identifiers. Hashing is done in place using SHA256 and a 64-bit salt. Of note is that missing values are left missing.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.setrid-Tuple{Any,DeIdDicts}","page":"API","title":"DeIdentification.setrid","text":"setrid(val, dicts)\n\nSet the value passed (a hex string) to a human readable integer.  It generates a new ID if the value hasn't been seen before, otherwise the existing ID is used.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.write_dicts-Tuple{DeIdDicts,Any,Any}","page":"API","title":"DeIdentification.write_dicts","text":"write_dicts(deid_dicts)\n\nWrites DeIdDicts structure to file. The dictionaries are written to josn. The files are written to the  output_path specified in the configuration YAML.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#DeIdentification.write_yaml-Tuple{String,AbstractDict}","page":"API","title":"DeIdentification.write_yaml","text":"write_yaml(file::String, yml::AbstractDict)\n\nRecursively writes YAML object to file. A YAML object is a dictionary, which can contain arrays of YAML objects.  See YAML.jl for more on format.\n\n\n\n\n\n","category":"method"}]
}
