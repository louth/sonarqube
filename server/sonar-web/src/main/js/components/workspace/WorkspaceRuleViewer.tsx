/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import { RuleDescriptor } from './context';
import WorkspaceHeader, { Props as WorkspaceHeaderProps } from './WorkspaceHeader';
import WorkspaceRuleDetails from './WorkspaceRuleDetails';
import WorkspaceRuleTitle from './WorkspaceRuleTitle';
import { Omit } from '../../app/types';

export interface Props extends Omit<WorkspaceHeaderProps, 'children' | 'onClose'> {
  rule: RuleDescriptor;
  height: number;
  onClose: (componentKey: string) => void;
  onLoad: (details: { key: string; name: string }) => void;
}

export default class WorkspaceRuleViewer extends React.PureComponent<Props> {
  handleClose = () => {
    this.props.onClose(this.props.rule.key);
  };

  handleLoaded = (rule: { name: string }) => {
    this.props.onLoad({ key: this.props.rule.key, name: rule.name });
  };

  render() {
    const { rule } = this.props;

    return (
      <div className="workspace-viewer">
        <WorkspaceHeader
          maximized={this.props.maximized}
          onClose={this.handleClose}
          onCollapse={this.props.onCollapse}
          onMaximize={this.props.onMaximize}
          onMinimize={this.props.onMinimize}
          onResize={this.props.onResize}>
          <WorkspaceRuleTitle rule={rule} />
        </WorkspaceHeader>

        <div className="workspace-viewer-container" style={{ height: this.props.height }}>
          <WorkspaceRuleDetails
            onLoad={this.handleLoaded}
            organizationKey={rule.organization}
            ruleKey={rule.key}
          />
        </div>
      </div>
    );
  }
}
