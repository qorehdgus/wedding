package com.wedding.backend.query.invitation;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InvitationQueryMapper {

    List<InvitationSummaryDto> findAll(@Param("venue") String venue);
}
