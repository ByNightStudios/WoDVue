/**
 *
 * CustomTagInput
 *
 */

import React, { memo, useState } from 'react';
import {
  Tag,
  Input,
  Tooltip
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const handleInputConfirm = (
  inputValue,
  tags,
  updateTags,
  setInputVisible,
  setInputValue
) => {
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }

  updateTags(tags);
  setInputVisible(false);
  setInputValue('');
};

const handleInputChange = (e, setInputValue) => {
  setInputValue(e.target.value);
};

const handleClose = (tags, removedTag, updateTags) => {
  const updatedTags = tags.filter(tag => tag !== removedTag);
  updateTags(updatedTags);
};

const CustomTagInput = props => {
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);

  const {
    tags,
    updateTags,
    newTagText,
    isNotErmOrErmSupervisor
  } = props;

  return (
    <>
      {tags?.map(tag => {
        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="edit-tag py-1 px-2"
            key={tag}
            closable={!isNotErmOrErmSupervisor}
            onClose={() => handleClose(tags, tag, updateTags)}
          >
            <span
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );

        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : tagElem;
      })}

      {inputVisible && (
        <Input
          type="text"
          size="small"
          className="tag-input py-1 px-2"
          value={inputValue}
          autoFocus
          onChange={e => handleInputChange(e, setInputValue)}
          onBlur={() => handleInputConfirm(
            inputValue,
            tags,
            updateTags,
            setInputVisible,
            setInputValue
          )}
          onPressEnter={() => handleInputConfirm(
            inputValue,
            tags,
            updateTags,
            setInputVisible,
            setInputValue
          )}
        />
      )}

      {!inputVisible && (
        <Tag className="site-tag-plus py-1 px-2" onClick={() => {
          if (isNotErmOrErmSupervisor) return;
          setInputVisible(true);
        }}>
          <PlusOutlined /> {newTagText}
        </Tag>
      )}
    </>
  )
}

CustomTagInput.propTypes = {};

export default memo(CustomTagInput);
