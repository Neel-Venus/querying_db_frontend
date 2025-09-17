"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { COLLECTION_SCHEMAS } from "@/lib/schemas"

const operators = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Not Contains" },
  { value: "starts_with", label: "Starts With" },
  { value: "ends_with", label: "Ends With" },
  { value: "regex", label: "Regex" },
  { value: "in", label: "In" },
  { value: "not_in", label: "Not In" },
  { value: "gt", label: "Greater Than" },
  { value: "gte", label: "Greater Than or Equal" },
  { value: "lt", label: "Less Than" },
  { value: "lte", label: "Less Than or Equal" },
  { value: "between", label: "Between" },
  { value: "exists", label: "Exists" },
  { value: "not_exists", label: "Not Exists" },
]

interface QueryConditionProps {
  condition: any
  collection: string
  onChange: (condition: any) => void
  onRemove: () => void
}

export function QueryCondition({
  condition,
  collection,
  onChange,
  onRemove,
}: QueryConditionProps) {
  const schema = COLLECTION_SCHEMAS[collection]
  const handleFieldChange = (field: string) => {
    onChange({ ...condition, field })
  }

  const handleOperatorChange = (operator: string) => {
    onChange({ ...condition, operator })
  }

  const handleValueChange = (value: string) => {
    onChange({ ...condition, value })
  }

  const handleValuesChange = (values: string) => {
    const valuesArray = values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v)
    onChange({ ...condition, values: valuesArray })
  }

  const getFieldType = (fieldName: string) => {
    if (!schema || !fieldName) return null
    return schema[fieldName]
  }

  const getPlaceholder = (fieldName: string) => {
    const fieldType = getFieldType(fieldName)
    if (!fieldType) return "Value"

    if (fieldType.enum) {
      return `Select from: ${fieldType.enum.join(", ")}`
    }

    switch (fieldType.type) {
      case "string":
        return "Enter text..."
      case "number":
        return "Enter number..."
      case "date":
        return "Enter date (YYYY-MM-DD)..."
      case "objectId":
        return "Enter ObjectId..."
      case "boolean":
        return "true or false"
      case "object":
        return "JSON object..."
      default:
        return "Enter value..."
    }
  }

  const isArrayOperator = ["in", "not_in", "between"].includes(
    condition.operator
  )
  const isExistsOperator = ["exists", "not_exists"].includes(condition.operator)

  const renderValueInput = () => {
    const fieldType = getFieldType(condition.field)

    if (isArrayOperator) {
      return (
        <input
          type="text"
          className="input text-sm"
          placeholder="Comma-separated values"
          value={condition.values?.join(", ") || ""}
          onChange={(e) => handleValuesChange(e.target.value)}
        />
      )
    }

    // If field has enum values, show dropdown
    if (fieldType?.enum) {
      return (
        <select
          className="input text-sm"
          value={condition.value}
          onChange={(e) => handleValueChange(e.target.value)}
        >
          <option value="">Select value</option>
          {fieldType.enum.map((enumValue: string) => (
            <option key={enumValue} value={enumValue}>
              {enumValue}
            </option>
          ))}
        </select>
      )
    }

    // Regular input with appropriate type
    const inputType =
      fieldType?.type === "number"
        ? "number"
        : fieldType?.type === "date"
        ? "date"
        : "text"

    return (
      <input
        type={inputType}
        className="input text-sm"
        placeholder={getPlaceholder(condition.field)}
        value={condition.value || ""}
        onChange={(e) => handleValueChange(e.target.value)}
      />
    )
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <select
          className="input text-sm"
          value={condition.field}
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          <option value="">Select Field</option>
          {schema &&
            Object.keys(schema).map((field) => {
              const fieldInfo = schema[field]
              const displayName = field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())
              const typeInfo = fieldInfo.enum
                ? `(${fieldInfo.enum.join("|")})`
                : `(${fieldInfo.type})`
              return (
                <option key={field} value={field}>
                  {displayName} {typeInfo}
                  {fieldInfo.required && " *"}
                </option>
              )
            })}
        </select>
      </div>

      <div className="flex-1">
        <select
          className="input text-sm"
          value={condition.operator}
          onChange={(e) => handleOperatorChange(e.target.value)}
        >
          <option value="">Select Operator</option>
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      {!isExistsOperator && <div className="flex-1">{renderValueInput()}</div>}

      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:text-red-700"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
