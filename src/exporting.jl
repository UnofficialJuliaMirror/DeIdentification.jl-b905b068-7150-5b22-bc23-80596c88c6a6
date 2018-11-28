

import Base.write

function write(deid::DeIdentified)
    outdir = deid.deid_config.outdir
    info(deid.logger, "$(now()) Writing DeIdenfied struct")
    for (i, df) in enumerate(deid.df_array)
        df_name = deid.deid_config.df_configs[i].name
        filename = joinpath(outdir, "deid_" * df_name * ".csv")
        info(deid.logger, "$(now()) Writing de-identified dataframe $(df_name) to $(filename)")
        CSV.write(filename, df.df)
    end


    idfile = joinpath(outdir, "id_dicts.json")
    info(deid.logger, "$(now()) Writing ID dictionaries to $(idfile)")
    write(idfile, JSON.Writer.json(deid.id_dicts, 4))

    dateshift_file = joinpath(outdir, "dateshifts.json")
    info(deid.logger, "$(now()) Writing dateshift values to $(dateshift_file)")
    write(dateshift_file, JSON.Writer.json(deid.dateshift_dict, 4))

    saltfile = joinpath(outdir, "salts.json")
    info(deid.logger, "$(now()) Writing salt values to $(saltfile)")
    write(saltfile, JSON.Writer.json(deid.salt_dict, 4))
    nothing
end
