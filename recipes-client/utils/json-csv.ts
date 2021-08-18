import { saveAs } from "file-saver";

export const DEFAULT_FILE_FORMAT = "csv";
export const DEFAULT_FILE_NAME = "json-to-csv";
export const CONVERT_LABEL = "Convert Json to Csv";
export const BLOB_TYPE_TEXT = "text/plain";
export const BLOB_CHARSET_UTF8 = "utf-8";
export const DOT = ".";
export const COMMA = ",";

interface bodyData {
  data: Record<string, string>[];
  fields: string[];
  separator: string;
}
const getBodyData = ({ data, fields, separator }: bodyData): string => {
    return data.map((row: { [x: string]: string; hasOwnProperty: (arg0: string) => string; }) => {
      return fields.map((field: string | number) => {
        if (Object.prototype.hasOwnProperty.call(row, field)){
          return row[field];
        }
        return null;
      }).join(separator);
    }).join("\n");
  };

interface convertToCsvData {
  data: Record<string, string>;
  fields: string[];
  headers: string[];
  separator: string;
}
const convertToCsv = ({ data, fields, headers, separator }: convertToCsvData): string => {
    const body = getBodyData({ data, fields, separator }),
      header = headers.join(separator);
  
    return header + "\n" + body;
  };

interface saveCsvData {
  data: string;
  fileformat: string;
  filename: string;
}
const saveCsv = ({ data, fileformat, filename }: saveCsvData): void => {
  const blob = new Blob(
    [data as BlobPart],
    {
      type: BLOB_TYPE_TEXT
    }
  );

  saveAs(blob, [`${filename}.${fileformat}`]);
};

interface csvData {
  data: Record<string, string>[];
  fields: Record<string, string>;
  fileformat: string|undefined;
  filename: string|undefined;
  separator: string;
}
export const saveAsCsv = ({
      data,
      fields,
      fileformat = DEFAULT_FILE_FORMAT,
      filename = DEFAULT_FILE_NAME,
      separator = COMMA
    }: csvData): void => {
      const dataFields = Object.keys(fields);
      const headers = Object.keys(fields).map((key) => fields[key]);
  
      saveCsv({
        data: convertToCsv({ data, fields: dataFields, headers, separator }),
        fileformat,
        filename,
      });
    };