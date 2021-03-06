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
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import * as theme from '../../app/theme';
import Tooltip from '../controls/Tooltip';
import { translate } from '../../helpers/l10n';
import { Visibility, Organization, CurrentUser } from '../../app/types';
import { isSonarCloud } from '../../helpers/system';
import { isCurrentUserMemberOf, isPaidOrganization } from '../../helpers/organizations';
import { getCurrentUser, getOrganizationByKey, getMyOrganizations } from '../../store/rootReducer';
import VisibleIcon from '../icons-components/VisibleIcon';
import DocTooltip from '../docs/DocTooltip';

interface StateToProps {
  currentUser: CurrentUser;
  organization?: Organization;
  userOrganizations: Organization[];
}

interface OwnProps {
  className?: string;
  organization: Organization | string | undefined;
  qualifier: string;
  tooltipProps?: { projectKey: string };
  visibility: Visibility;
}

interface Props extends OwnProps, StateToProps {
  organization: Organization | undefined;
}

export function PrivacyBadge({
  className,
  currentUser,
  organization,
  qualifier,
  userOrganizations,
  tooltipProps,
  visibility
}: Props) {
  const onSonarCloud = isSonarCloud();
  if (
    visibility !== Visibility.Private &&
    (!onSonarCloud || !isCurrentUserMemberOf(currentUser, organization, userOrganizations))
  ) {
    return null;
  }

  let icon = null;
  if (isPaidOrganization(organization) && visibility === Visibility.Public) {
    icon = <VisibleIcon className="little-spacer-right" fill={theme.blue} />;
  }

  const badge = (
    <div
      className={classNames('outline-badge', className, {
        'badge-info': Boolean(icon),
        'badge-icon': Boolean(icon)
      })}>
      {icon}
      {translate('visibility', visibility)}
    </div>
  );

  if (onSonarCloud && organization) {
    return (
      <DocTooltip
        className={className}
        doc={getDoc(visibility, icon, organization)}
        overlayProps={{ ...tooltipProps, organization: organization.key }}>
        {badge}
      </DocTooltip>
    );
  }

  return (
    <Tooltip overlay={translate('visibility', visibility, 'description', qualifier)}>
      {badge}
    </Tooltip>
  );
}

const mapStateToProps = (state: any, { organization }: OwnProps) => {
  if (typeof organization === 'string') {
    organization = getOrganizationByKey(state, organization);
  }
  return {
    currentUser: getCurrentUser(state),
    organization,
    userOrganizations: getMyOrganizations(state)
  };
};

export default connect<StateToProps, {}, OwnProps>(mapStateToProps)(PrivacyBadge);

function getDoc(visibility: Visibility, icon: JSX.Element | null, organization: Organization) {
  let doc;
  if (visibility === Visibility.Private) {
    doc = import(/* webpackMode: "eager" */ 'Docs/tooltips/project/visibility-private.md');
  } else if (icon) {
    if (organization.canAdmin) {
      doc = import(/* webpackMode: "eager" */ 'Docs/tooltips/project/visibility-public-paid-org-admin.md');
    } else {
      doc = import(/* webpackMode: "eager" */ 'Docs/tooltips/project/visibility-public-paid-org.md');
    }
  } else if (organization.canAdmin) {
    doc = import(/* webpackMode: "eager" */ 'Docs/tooltips/project/visibility-public-admin.md');
  } else {
    doc = import(/* webpackMode: "eager" */ 'Docs/tooltips/project/visibility-public.md');
  }
  return doc;
}
